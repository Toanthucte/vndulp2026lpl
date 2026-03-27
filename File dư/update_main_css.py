css_content = """*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: var(--font-family-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  height: 100vh;
  overflow: hidden; /* Fix scroll to app main */
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4 {
  font-family: var(--font-family-heading);
  font-weight: 600;
  line-height: 1.2;
}

p {
  margin-bottom: 1rem;
}

.text-accent {
  color: var(--color-accent);
}
.text-muted {
  color: #6b7280;
}

/* Utils */
.hidden { display: none !important; }

/* Transitions */
@keyframes slideInFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Layout */
.app-header {
  background-color: var(--color-primary);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.app-header h1 {
  font-size: var(--font-size-h4);
  margin: 0;
  flex: 1;
  text-align: center;
}

.icon-btn {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background-color: rgba(255,255,255,0.1);
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding-bottom: var(--nav-height);
  position: relative;
}

.view {
  padding: 1rem;
  animation: slideInFade 0.3s ease-out forwards;
}

/* ----- HOME VIEW ----- */
.search-section {
  background: var(--color-card-bg);
  padding: 1.5rem 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
  text-align: center;
}
.search-section h2 {
  font-size: var(--font-size-h3);
  margin-bottom: 1rem;
  color: var(--color-primary);
}
.search-box {
  display: flex;
  align-items: center;
  background-color: var(--color-neutral);
  border-radius: var(--radius-full);
  padding: 0.5rem 1rem;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.search-icon {
  color: #9ca3af;
  margin-right: 0.5rem;
}
#search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  padding: 0.5rem 0;
}
.voice-btn {
  color: var(--color-primary);
  font-size: 1.2rem;
}

/* Suggested Tags */
.suggested-tags-section h3, .search-results-section h3 {
  font-size: var(--font-size-h4);
  margin-bottom: 1rem;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.tag-chip {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-small);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}
.tag-chip:hover, .tag-chip:active {
  background: var(--color-secondary);
  color: white;
  border-color: var(--color-secondary);
}

/* Results */
.results-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.result-card {
  background: var(--color-card-bg);
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 1px solid var(--color-border);
}
.result-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}
.result-title {
  font-weight: 600;
  color: var(--color-primary);
}

/* ----- DETAIL VIEW ----- */
.detail-header {
  margin-bottom: 1.5rem;
}
#detail-title {
  font-size: var(--font-size-h2);
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}
.category-badge {
  display: inline-block;
  background: var(--color-neutral);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  color: var(--color-text);
}

.treatment-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
}
.treatment-title {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: var(--font-size-h4);
}

.media-container {
  width: 100%;
  background: #fff;
  text-align: center;
}
.media-container img {
  max-width: 100%;
  height: auto;
  display: block;
}

.instruction-box {
  padding: 1.25rem;
}
.instruction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.instruction-header h4 {
  margin: 0;
  color: var(--color-secondary);
}
.btn-tts {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}
.btn-tts:active {
  transform: scale(0.95);
}
.instruction-text p {
  margin-bottom: 0.5rem;
}
.instruction-text p:last-child {
  margin-bottom: 0;
}

/* Accordion */
.accordion-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.accordion-item {
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}
.accordion-header {
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-primary);
  cursor: pointer;
}
.acc-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.acc-icon {
  transition: transform 0.3s ease;
}
.accordion-header[aria-expanded="true"] .acc-icon {
  transform: rotate(180deg);
}
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.acc-inner {
  padding: 0 1rem 1rem 1rem;
}

/* Videos */
.video-grid {
  display: grid;
  gap: 1rem;
}
.video-placeholder {
  background: var(--color-neutral);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.video-placeholder i {
  color: var(--color-error);
  font-size: 2rem;
}

/* About */
.about-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background-color: var(--color-card-bg);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
}
.nav-item {
  color: #9ca3af;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  font-size: 0.8rem;
  gap: 0.25rem;
  transition: color 0.2s;
}
.nav-item i {
  font-size: 1.25rem;
}
.nav-item.active {
  color: var(--color-primary);
  font-weight: 600;
}
"""

with open(r"d:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\main.css", "w", encoding="utf-8") as f:
    f.write(css_content)
    
print("Updated main.css")
