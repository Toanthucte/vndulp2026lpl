from __future__ import annotations

import html
import json
import re
import unicodedata
from pathlib import Path
from typing import TypedDict

ROOT = Path(r"d:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl")
IMAGE_ROOT = ROOT / "assets" / "image"
DATA_JS = ROOT / "js" / "data.js"
MAP_MD = IMAGE_ROOT / "IMAGE_MAP_ALL.md"


def resolve_reference_md() -> Path:
    candidates = [
        ROOT / "Tài liệu VNDULP" / "VNDULPNhapMon_clean.md",
    ]
    for path in candidates:
        if path.exists():
            return path
    return candidates[0]


REFERENCE_MD = resolve_reference_md()

IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}

CASE_PREFIXES = {
    "trường hợp",
    "hu chứng",
    "hư chứng",
    "thực chứng",
    "thuc chứng",
    "nặng",
    "nhẹ",
    "bàn tay sấp",
    "bàn tay ngửa",
    "cẳng tay trước",
    "tác động theo 2 hướng",
}


class MediaItem(TypedDict):
    src: str
    caption: str


class TreatmentData(TypedDict):
    media: list[MediaItem]
    instructions: str


class DiseaseData(TypedDict):
    id: str
    category: str
    title: str
    keywords: list[str]
    treatment: TreatmentData
    symptoms: str
    videos: list[str]


def strip_accents(text: str) -> str:
    normalized = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn").replace("đ", "d").replace("Đ", "D")


def slugify(text: str) -> str:
    text = strip_accents(text).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def natural_key(name: str):
    return [int(chunk) if chunk.isdigit() else chunk.lower() for chunk in re.split(r"(\d+)", name)]


def normalize_match_key(text: str) -> str:
    text = strip_accents(text).lower()
    text = re.sub(r"\([^)]*\)", " ", text)
    text = text.replace("&", " va ")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def clean_line(text: str) -> str:
    text = html.unescape(text).strip()
    text = re.sub(r"\s+", " ", text)
    return text


def should_skip_content_line(line: str) -> bool:
    if not line:
        return True
    if line.startswith("#"):
        return True
    if line.lower().startswith("copyright"):
        return True
    if line.startswith("***"):
        return True
    if re.match(r"^(H\.?\s*\d+[a-z]?)$", line, flags=re.IGNORECASE):
        return True
    if re.match(r"^\d+[A-Z]$", line):
        return True
    if re.match(r"^\(\d+\)$", line):
        return True
    if line in {"A", "B", "C", "D", "E", "F"}:
        return True
    return False


def merge_wrapped_lines(lines: list[str]) -> list[str]:
    merged: list[str] = []
    for raw in lines:
        line = clean_line(raw)
        if not line:
            continue

        if not merged:
            merged.append(line)
            continue

        prev = merged[-1]
        prev_ends_break = prev.endswith((":", ".", "!", "?", ")"))
        starts_lower = bool(re.match(r"^[a-zà-ỹ]", line))

        if starts_lower and not prev_ends_break:
            merged[-1] = f"{prev} {line}"
        else:
            merged.append(line)

    return merged


def normalize_case_line(line: str) -> str:
    line = line.strip()
    line = re.sub(r"^\*+", "", line).strip()
    return line.rstrip(":")


def is_case_marker(line: str) -> bool:
    key = normalize_match_key(line.rstrip(":"))
    if key in CASE_PREFIXES:
        return True
    if key.startswith("truong hop"):
        return True
    if line.endswith(":") and len(line.split()) <= 5:
        return True
    return False


def parse_case_groups(items: list[str]) -> tuple[list[str], list[tuple[str, list[str]]]]:
    general: list[str] = []
    groups: list[tuple[str, list[str]]] = []
    current_title: str | None = None
    current_items: list[str] = []

    for raw in items:
        line = clean_line(raw)
        if should_skip_content_line(line):
            continue

        if is_case_marker(line):
            # Handle collapsed lines like "Trường hợp do tỳ vị Điểm tiếp giáp...".
            split_match = re.match(
                r"^(Trường hợp do\s+.+?)\s+(Khám|Điểm|Tác\s*động|Bấm|Day|Dùng|Hơ|Vuốt|Xoa|Chà|Mặt|Vùng)\b\s*(.+)$",
                line,
                flags=re.IGNORECASE,
            )
            first_detail: str | None = None
            if split_match:
                line = split_match.group(1)
                first_detail = f"{split_match.group(2)} {split_match.group(3)}".strip()

            if current_title:
                groups.append((current_title, current_items.copy()))
            current_title = normalize_case_line(line)
            current_items = []
            if first_detail:
                current_items.append(first_detail)
            continue

        if current_title:
            current_items.append(line)
        else:
            general.append(line)

    if current_title:
        groups.append((current_title, current_items.copy()))

    return general, groups


def to_html_ul(items: list[str]) -> str:
    cleaned = [clean_line(i) for i in items if clean_line(i)]
    if not cleaned:
        return ""
    return "<ul>" + "".join(f"<li>{html.escape(item)}</li>" for item in cleaned) + "</ul>"


def to_html_cases(groups: list[tuple[str, list[str]]], ordered: bool) -> str:
    if not groups:
        return ""

    if ordered and len(groups) >= 2:
        parts = ["<ol>"]
        for title, details in groups:
            detail_html = to_html_ul(details)
            if detail_html:
                parts.append(f"<li><b>{html.escape(title)}</b>{detail_html}</li>")
            else:
                parts.append(f"<li><b>{html.escape(title)}</b></li>")
        parts.append("</ol>")
        return "".join(parts)

    # 1 case: keep as section title + bullet list for readability.
    title, details = groups[0]
    if details:
        return f"<p><b>{html.escape(title)}:</b></p>" + to_html_ul(details)
    return f"<p><b>{html.escape(title)}</b></p>"


def clean_caption_from_file_stem(stem: str) -> str:
    text = stem.strip()
    text = re.sub(r"^Picture\d+[-_]*", "", text, flags=re.IGNORECASE)

    parts = text.split("-", 1)
    if len(parts) == 2 and re.match(r"^[A-Za-z]\d+[a-z0-9-]*$", parts[0]):
        text = parts[1].strip()

    text = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", text)
    text = text.replace("_", " ").replace("-", " ")
    text = re.sub(r"^(?:[A-Za-z]\s+){2,4}(?=[A-Za-zÀ-ỹ])", "", text)
    text = re.sub(r"^[A-Za-z]\s+(?=[A-ZÀ-Ỵ])", "", text)
    text = re.sub(r"\s+", " ", text).strip(" .")
    return text


def beautify_diagram_caption(caption: str) -> str:
    if re.search(r"[àáảãạăắằẳẵặâấầẩẫậđêếềểễệôốồổỗộơớờởỡợưứừửữựíìỉĩịúùủũụýỳỷỹỵ]", caption, flags=re.IGNORECASE):
        return caption

    out = caption
    replacements = [
        ("Do Hinh", "Đồ hình"),
        ("Chinh", "chính"),
        ("Bo Tieu Viem", "bộ tiêu viêm"),
        ("Phan Chieu", "Phản chiếu"),
        ("Ngoai Vi", "ngoại vi"),
        ("Co The", "cơ thể"),
        ("Tren", "trên"),
        ("Ban Tay", "bàn tay"),
        ("Ban Chan", "bàn chân"),
        ("Cang Chan", "cẳng chân"),
        ("Dau", "đầu"),
        ("Va", "và"),
        ("Mat", "mặt"),
        ("ODau", "ở đầu"),
        ("Co Gay", "cổ gáy"),
        ("Nhin Nghieng", "nhìn nghiêng"),
        ("Bo Phan", "bộ phận"),
        ("Sinh Duc", "sinh dục"),
        ("Nu", "nữ"),
        ("Nam", "nam"),
        ("He Noi Tiet", "hệ nội tiết"),
        ("Goi", "gối"),
        ("Tac dong", "Tác động"),
        ("Ngon Chan Cai", "ngón chân cái"),
        ("Nhuc", "nhức"),
        ("Cham Gay", "chẩm gáy"),
        ("Thai Duong", "Thái Dương"),
        ("Dinh Tai", "đỉnh tai"),
    ]
    for src, dst in replacements:
        out = re.sub(rf"\b{re.escape(src)}\b", dst, out, flags=re.IGNORECASE)

    out = re.sub(r"\s+", " ", out).strip(" .")
    return out


def list_image_files(folder: Path) -> list[Path]:
    # Avoid Path.is_file() here because very long Windows paths can return False unexpectedly.
    files = [p for p in folder.iterdir() if p.suffix.lower() in IMG_EXTS]
    files.sort(key=lambda p: natural_key(p.name))
    return files


def to_web_path(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return f"./{rel}"


def parse_reference_markdown() -> dict[str, dict[str, list[str] | str]]:
    if not REFERENCE_MD.exists():
        return {}

    lines = REFERENCE_MD.read_text(encoding="utf-8").splitlines()
    sections: dict[str, list[str]] = {}
    current_title: str | None = None
    current_lines: list[str] = []

    for raw_line in lines:
        line = clean_line(raw_line)
        if line.startswith("##### "):
            if current_title and current_lines:
                sections[current_title] = merge_wrapped_lines(current_lines)
            current_title = clean_line(line.replace("##### ", "", 1))
            current_lines = []
            continue

        if current_title is not None:
            current_lines.append(line)

    if current_title and current_lines:
        sections[current_title] = merge_wrapped_lines(current_lines)

    parsed: dict[str, dict[str, list[str] | str]] = {}

    def route_preamble_line(line: str, intro_bucket: list[str], symptom_bucket: list[str], cause_bucket: list[str]) -> None:
        lowered = normalize_match_key(line)
        if not lowered:
            return

        if "trieu chung" in lowered or "dau" in lowered or "met" in lowered or "hoa mat" in lowered:
            symptom_bucket.append(line)
            return

        if "nguyen nhan" in lowered or "thuong do" in lowered or "do " in lowered or "hoi chung" in lowered:
            cause_bucket.append(line)
            return

        intro_bucket.append(line)

    def is_heading_fragment(line: str) -> bool:
        key = normalize_match_key(line)
        return key in {
            "cach",
            "kham",
            "kham va",
            "kham dieu",
            "kham va dieu tri",
            "cach kham",
            "cach kham va dieu tri",
            "dieu tri",
            "kham va dieu",
        }

    def heading_bucket_without_colon(line: str) -> list[str] | None:
        key = normalize_match_key(line)
        if key in {"trieu chung", "nhung trieu chung", "trieu trung"}:
            return symptoms
        if key in {"nguyen nhan", "nguyen nhan va trieu chung"}:
            return causes
        if key in {"kham dieu tri", "kham va dieu tri", "cach kham va dieu tri", "dieu tri", "kham va dieu"}:
            return treatment
        return None

    for title, raw_items in sections.items():
        intro: list[str] = []
        symptoms: list[str] = []
        causes: list[str] = []
        treatment: list[str] = []
        current_bucket = intro

        for raw in raw_items:
            line = clean_line(raw)
            if should_skip_content_line(line):
                continue

            lower = line.lower()

            no_colon_bucket = heading_bucket_without_colon(line)
            if no_colon_bucket is not None:
                current_bucket = no_colon_bucket
                continue

            inline_heading = re.match(
                r"^(.+?)\s+(Cách\s*khám\s*và\s*điều\s*trị|Khám\s*&\s*điều\s*trị|Khám\s*và\s*điều\s*trị|Điều\s*trị)\s*:\s*$",
                line,
                flags=re.IGNORECASE,
            )
            if inline_heading:
                preamble = clean_line(inline_heading.group(1))
                if preamble and not should_skip_content_line(preamble) and not is_heading_fragment(preamble):
                    route_preamble_line(preamble, intro, symptoms, causes)
                current_bucket = treatment
                continue

            if "triệu chứng" in lower and line.endswith(":"):
                current_bucket = symptoms
                continue
            if "nguyên nhân" in lower and line.endswith(":"):
                current_bucket = causes
                continue
            if (
                ("khám" in lower and "điều trị" in lower and line.endswith(":"))
                or ("điều trị" in lower and line.endswith(":"))
                or ("cách khám" in lower and "điều trị" in lower and line.endswith(":"))
            ):
                current_bucket = treatment
                continue

            match = re.match(
                r"^(Triệu\s*chứng|Nguyên\s*nhân|Khám\s*&\s*Điều\s*trị|Khám\s*và\s*Điều\s*trị|Điều\s*trị)\s*:\s*(.+)$",
                line,
                flags=re.IGNORECASE,
            )
            if match:
                label = normalize_match_key(match.group(1))
                value = clean_line(match.group(2))
                if should_skip_content_line(value):
                    continue
                if "trieu chung" in label:
                    symptoms.append(value)
                    current_bucket = symptoms
                elif "nguyen nhan" in label:
                    causes.append(value)
                    current_bucket = causes
                else:
                    treatment.append(value)
                    current_bucket = treatment
                continue

            current_bucket.append(line)

        key = normalize_match_key(title)
        parsed[key] = {
            "title": title,
            "intro": merge_wrapped_lines(intro),
            "symptoms": merge_wrapped_lines(symptoms),
            "causes": merge_wrapped_lines(causes),
            "treatment": merge_wrapped_lines(treatment),
        }

        short_title = re.sub(r"\([^)]*\)", "", title).strip()
        short_key = normalize_match_key(short_title)
        if short_key and short_key not in parsed:
            parsed[short_key] = parsed[key]

    return parsed


def find_reference_for_disease(
    disease_title: str,
    ref_data: dict[str, dict[str, list[str] | str]],
) -> dict[str, list[str] | str] | None:
    if not ref_data:
        return None

    key = normalize_match_key(disease_title)
    if key in ref_data:
        return ref_data[key]

    key_tokens = set(key.split())
    best_match: dict[str, list[str] | str] | None = None
    best_score = 0.0

    for ref_key, ref_value in ref_data.items():
        ref_tokens = set(ref_key.split())
        if not ref_tokens:
            continue
        overlap = len(key_tokens & ref_tokens)
        if overlap == 0:
            continue
        score = overlap / max(len(key_tokens), len(ref_tokens))
        if score > best_score:
            best_score = score
            best_match = ref_value

    if best_score >= 0.5:
        return best_match
    return None


def entry_list(ref_entry: dict[str, list[str] | str] | None, key: str) -> list[str]:
    if not ref_entry:
        return []
    value = ref_entry.get(key)
    if isinstance(value, list):
        return value
    return []


def build_symptoms_html(disease_title: str, ref_entry: dict[str, list[str] | str] | None) -> str:
    intro = entry_list(ref_entry, "intro") if ref_entry else []
    symptoms = entry_list(ref_entry, "symptoms") if ref_entry else []
    causes = entry_list(ref_entry, "causes") if ref_entry else []

    heading_noise = {
        "cach",
        "kham",
        "kham va",
        "kham va dieu",
        "kham va dieu tri",
        "dieu tri",
    }
    intro = [line for line in intro if normalize_match_key(line) not in heading_noise]

    # Promote source notes when docs do not separate labels clearly.
    for line in intro:
        low = normalize_match_key(line)
        if ("thuong do" in low or "nguyen nhan" in low or "hoi chung" in low) and line not in causes:
            causes.append(line)
        elif ("trieu chung" in low or "dau" in low or "met" in low or "hoa mat" in low) and line not in symptoms:
            symptoms.append(line)

    if not symptoms:
        symptoms = ["Tài liệu gốc chưa mô tả tách riêng triệu chứng cho mục bệnh này."]
    if not causes:
        causes = ["Tài liệu gốc chưa nêu rõ nguyên nhân riêng; ưu tiên theo dõi đáp ứng khi thực hiện phác đồ."]

    blocks: list[str] = []

    if intro:
        intro_general, intro_cases = parse_case_groups(intro[:10])
        block = "<p><b>Tổng quan:</b></p>"
        if intro_general:
            block += to_html_ul(intro_general)
        if intro_cases:
            block += to_html_cases(intro_cases, ordered=True)
        if block != "<p><b>Tổng quan:</b></p>":
            blocks.append(block)

    symptom_general, symptom_cases = parse_case_groups(symptoms[:12])
    symptom_block = "<p><b>Triệu chứng:</b></p>"
    if symptom_general:
        symptom_block += to_html_ul(symptom_general)
    if symptom_cases:
        symptom_block += to_html_cases(symptom_cases, ordered=True)
    blocks.append(symptom_block)

    cause_general, cause_cases = parse_case_groups(causes[:12])
    cause_block = "<p><b>Nguyên nhân:</b></p>"
    if cause_general:
        cause_block += to_html_ul(cause_general)
    if cause_cases:
        cause_block += to_html_cases(cause_cases, ordered=True)
    blocks.append(cause_block)

    return "".join(blocks)


def build_treatment_html(media: list[MediaItem], ref_entry: dict[str, list[str] | str] | None) -> str:
    reference_steps = entry_list(ref_entry, "treatment")

    blocks: list[str] = []
    if reference_steps:
        steps_general, steps_cases = parse_case_groups(reference_steps[:14])
        block = "<p><b>Phác đồ thực hiện:</b></p>"
        if steps_general:
            block += to_html_ul(steps_general)
        if steps_cases:
            block += to_html_cases(steps_cases, ordered=True)
        blocks.append(block)

    return "".join(blocks)


def parse_disease_folder(
    folder: Path,
    category_title: str,
    ref_data: dict[str, dict[str, list[str] | str]],
) -> DiseaseData | None:
    match = re.match(r"^([A-Z]\d+)-\s*(.+)$", folder.name)
    if not match:
        return None

    disease_code = match.group(1)
    disease_title = match.group(2).strip()
    media_files = list_image_files(folder)
    if not media_files:
        return None

    media: list[MediaItem] = []
    for media_file in media_files:
        media.append(
            {
                "src": to_web_path(media_file),
                "caption": clean_caption_from_file_stem(media_file.stem),
            }
        )

    ref_entry = find_reference_for_disease(disease_title, ref_data)

    disease: DiseaseData = {
        "id": slugify(f"{disease_code}-{disease_title}"),
        "category": category_title,
        "title": disease_title,
        "keywords": [
            slugify(disease_title).replace("-", " "),
            strip_accents(disease_title).lower(),
            disease_code.lower(),
        ],
        "treatment": {
            "media": media,
            "instructions": build_treatment_html(media, ref_entry),
        },
        "symptoms": build_symptoms_html(disease_title, ref_entry),
        "videos": [],
    }

    return disease


def build_diseases_and_map(
    ref_data: dict[str, dict[str, list[str] | str]],
) -> tuple[list[DiseaseData], str]:
    skip_dirs = {"Lý Thuyết Đồ Hình Đồng Ứng", "Đồ hình", "Thao tác"}
    categories = [p for p in IMAGE_ROOT.iterdir() if p.is_dir() and p.name not in skip_dirs]
    categories.sort(key=lambda p: natural_key(p.name))

    diseases: list[DiseaseData] = []
    map_lines = ["# IMAGE MAP ALL", "", "## Quy ước", "", "`assets/image/<Category>/<Disease>/<Image>`", ""]

    for category in categories:
        category_parts = category.name.split("-", 1)
        category_title = category_parts[1].strip() if len(category_parts) > 1 else category.name

        map_lines.append(f"## {category.name}")
        map_lines.append("")

        disease_folders = [p for p in category.iterdir() if p.is_dir()]
        disease_folders.sort(key=lambda p: natural_key(p.name))

        for d_folder in disease_folders:
            disease = parse_disease_folder(d_folder, category_title, ref_data)
            if not disease:
                continue

            diseases.append(disease)
            map_lines.append(f"### {d_folder.name}")
            map_lines.append("")
            for media in disease["treatment"]["media"]:
                map_lines.append(f"- {media['caption']}")
                map_lines.append(f"  - `{media['src']}`")
            map_lines.append("")

    return diseases, "\n".join(map_lines).strip() + "\n"


def build_diagram_sections() -> list[dict[str, str | list[MediaItem]]]:
    sections: list[dict[str, str | list[MediaItem]]] = []

    section_specs = [
        ("do-hinh", "Đồ hình", IMAGE_ROOT / "Đồ hình"),
        ("ly-thuyet", "Lý Thuyết Đồ Hình Đồng Ứng", IMAGE_ROOT / "Lý Thuyết Đồ Hình Đồng Ứng"),
        ("thao-tac", "Thao Tác", IMAGE_ROOT / "Thao tác"),
    ]

    for sid, title, folder in section_specs:
        items: list[MediaItem] = []
        if folder.exists():
            files = [p for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in IMG_EXTS]
            files.sort(key=lambda p: natural_key(p.name))
            for image_file in files:
                caption = clean_caption_from_file_stem(image_file.stem)
                caption = beautify_diagram_caption(caption)
                items.append(
                    {
                        "src": to_web_path(image_file),
                        "caption": caption,
                    }
                )

        sections.append({"id": sid, "title": title, "items": items})

    return sections


def build_popular_tags(diseases: list[DiseaseData]) -> list[str]:
    tags: list[str] = []
    seen: set[str] = set()

    for disease in diseases:
        title = disease["title"]
        if title not in seen:
            seen.add(title)
            tags.append(title)
        if len(tags) >= 18:
            break

    return tags


def main():
    ref_data = parse_reference_markdown()
    diseases, map_md = build_diseases_and_map(ref_data)
    diagram_sections = build_diagram_sections()
    popular_tags = build_popular_tags(diseases)

    app_data: dict[str, object] = {
        "popularTags": popular_tags,
        "diseases": diseases,
        "diagramSections": diagram_sections,
    }

    js = "// js/data.js\nconst appData = " + json.dumps(app_data, ensure_ascii=False, indent=2) + "\n"
    DATA_JS.write_text(js, encoding="utf-8")
    MAP_MD.write_text(map_md, encoding="utf-8")

    print(f"Generated {len(diseases)} diseases")
    print(f"Loaded reference sections: {len(ref_data)}")
    print("Data file:", DATA_JS)
    print("Map file:", MAP_MD)


if __name__ == "__main__":
    main()
