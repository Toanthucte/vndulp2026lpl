import io

css_file = r'd:\@Online-2024\App-KHTN-7-GK2\main.css'
with io.open(css_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the flashcard-front/back flex containers support the absolute positioned hint
old_front_back = '''.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  background-color: var(--color-bg);
  overflow-y: auto; /* Scroll if content long */
}'''

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
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  background-color: var(--color-bg);
  overflow-y: auto;
}'''

content = content.replace(old_front_back, new_front_back)

# Change fc-hint to absolute bottom right
old_hint = '''.fc-hint {
  font-size: 0.9rem;
  opacity: 0.6;
  margin-top: auto;
  padding-top: 1rem;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: pulse-op 2s infinite;
}'''

new_hint = '''.fc-hint {
  font-size: 0.85rem;
  opacity: 0.7;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  animation: pulse-op 2s infinite;
  /* Absolute position at bottom right */
  position: absolute;
  bottom: 1.2rem;
  right: 1.5rem;
  margin: 0;
  padding: 0;
}'''

content = content.replace(old_hint, new_hint)

with io.open(css_file, 'w', encoding='utf-8') as f:
    f.write(content)
