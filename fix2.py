import io, re

css_file = r'd:\@Online-2024\App-KHTN-7-GK2\main.css'
with io.open(css_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the flashcard-front/back flex containers support the absolute positioned hint
old_front_back = r'''\.flashcard-front,\s*\.flashcard-back\s*\{[^\}]+\}'''

new_front_back = '''.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 3.5rem; /* Make room for absolute hint */
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: var(--radius-lg);
  background-color: var(--color-bg);
  overflow-y: auto;
}'''

content = re.sub(old_front_back, new_front_back, content)

with io.open(css_file, 'w', encoding='utf-8') as f:
    f.write(content)
