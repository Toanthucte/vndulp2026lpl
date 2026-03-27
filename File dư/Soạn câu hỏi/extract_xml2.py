import re

file_path = r'd:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\Soạn câu hỏi\VNDULPNhapMon.xml'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Try to extract just body
body_match = re.search(r'<w:body>(.*?)</w:body>', content, re.DOTALL)
if body_match:
    content = body_match.group(1)

paragraphs = re.findall(r'<w:p\b[^>]*>(.*?)</w:p>', content, re.DOTALL)

md_lines = []
for p in paragraphs:
    # check for style
    is_heading = False
    style_match = re.search(r'<w:pStyle[^>]+w:val="(Heading\d+|Title)[^>]*>', p)
    if style_match:
        lvl = re.search(r'\d+', style_match.group(1))
        h_chars = '#' * (int(lvl.group(0)) + 1) if lvl else '##'
        is_heading = True
        
    texts = re.findall(r'<w:t(?:[^>]*)>([^<]*)</w:t>', p)
    if texts:
        line_text = "".join(texts).strip()
        # Clean up ToC spaces
        line_text = re.sub(r'\s{3,}\d+$', '', line_text)
        line_text = re.sub(r'\.{5,}', '', line_text)
        
        if line_text:
            if is_heading:
                h_level = h_chars if 'h_chars' in locals() else '##'
                md_lines.append(f"{h_level} {line_text}")
            else:
                md_lines.append(line_text)

result = '\n\n'.join(md_lines)

out_path = r'd:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\Soạn câu hỏi\VNDULPNhapMon.md'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write("# VIỆT NAM ĐỒNG ỨNG LIỆU PHÁP\n\n")
    f.write(result)
    
print(f'Done generating MD file! Total paragraphs: {len(md_lines)}')
