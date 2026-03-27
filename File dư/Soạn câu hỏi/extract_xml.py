import xml.etree.ElementTree as ET
import re

file_path = r'd:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\Soạn câu hỏi\VNDULPNhapMon.xml'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove XML namespaces to simplify parsing
content = re.sub(r'\sxmlns(:\w+)?="[^"]+"', '', content)

body_match = re.search(r'<w:body>(.*?)</w:body>', content, re.DOTALL)
if body_match:
    content_to_parse = '<root>' + body_match.group(1) + '</root>'
else:
    content_to_parse = '<root>' + content + '</root>'

# Replace any stray w: prefix in tags just to be safe
content_to_parse = re.sub(r'<(/?)\w+:', r'<\1', content_to_parse)

try:
    root = ET.fromstring(content_to_parse)
    
    markdown_lines = []
    
    # Iterate through paragraphs
    for p in root.findall('.//p'):
        p_text = ''
        for t in p.findall('.//t'):
            if t.text:
                p_text += t.text
        
        p_text = p_text.replace('  ', ' ')
        p_text = p_text.strip()
        
        if p_text:
            style = p.find('.//pStyle')
            if style is not None and ('Heading' in style.get('val', '') or 'Title' in style.get('val', '')):
                markdown_lines.append('## ' + p_text)
            else:
                markdown_lines.append(p_text)

    # Some heuristic cleanup for TOC trailing dots/page numbers:
    cleaned_lines = []
    for line in markdown_lines:
        # e.g., "Mục Lục ............... 4"
        line = re.sub(r'\s+\d+$', '', line) # remove trailing page numbers
        line = re.sub(r'\.{4,}', '', line) # remove leading dots if any
        if line.strip():
            cleaned_lines.append(line.strip())

    result = '\n\n'.join(cleaned_lines)

    out_path = r'd:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\Soạn câu hỏi\VNDULPNhapMon.md'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(result)
        
    print(f'Successfully compiled {len(cleaned_lines)} paragraphs.')
except Exception as e:
    print('Failed to parse:', e)
