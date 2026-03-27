js_content = r"""// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  // =================== UTILS ===================
  // Normalize Vietnamese to no-diacritics latin for fuzzy search
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '');
  }

  // =================== ELEMENTS ===================
  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('.nav-item');
  const btnBack = document.getElementById('btn-back');
  const btnInfo = document.getElementById('btn-info');
  const appTitle = document.getElementById('app-title');
  const searchInput = document.getElementById('search-input');
  const btnVoiceSearch = document.getElementById('btn-voice-search');
  const tagsContainer = document.getElementById('tags-container');
  const searchResultsSection = document.getElementById('search-results-section');
  const resultsContainer = document.getElementById('results-container');

  // Detail
  const detailTitle = document.getElementById('detail-title');
  const detailCategory = document.getElementById('detail-category');
  const detailImage = document.getElementById('detail-image');
  const detailInstruction = document.getElementById('detail-instruction');
  const detailNotes = document.getElementById('detail-notes');
  const detailVideos = document.getElementById('detail-videos');
  const btnReadInstruction = document.getElementById('btn-read-instruction');

  // =================== VIEW SWITCH ===================
  let previousView = 'view-home';
  let currentView = 'view-home';

  function switchView(targetId) {
    views.forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.remove('hidden');
      target.style.animation = 'none';
      target.offsetHeight;
      target.style.animation = '';
    }

    previousView = currentView;
    currentView = targetId;

    if (targetId === 'view-detail') {
      btnBack.classList.remove('hidden');
      appTitle.textContent = 'Chi tiết bệnh';
    } else {
      btnBack.classList.add('hidden');
      appTitle.textContent = 'Đồng Ứng Liệu Pháp';
    }

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.target === targetId);
    });
  }

  // Nav
  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchView(item.dataset.target);
    });
  });

  btnBack.addEventListener('click', () => {
    switchView(previousView || 'view-home');
  });

  btnInfo.addEventListener('click', () => {
    switchView('view-about');
  });

  // =================== TAGS ===================
  function renderTags() {
    tagsContainer.innerHTML = '';
    appData.popularTags.forEach(tag => {
      const chip = document.createElement('button');
      chip.className = 'tag-chip';
      chip.textContent = tag;
      chip.addEventListener('click', () => {
        searchInput.value = tag;
        handleSearch(tag);
      });
      tagsContainer.appendChild(chip);
    });
  }

  // =================== SEARCH ===================
  function handleSearch(query) {
    const q = normalize(query.trim());

    if (!q) {
      searchResultsSection.classList.add('hidden');
      return;
    }

    const results = appData.diseases.filter(disease => {
      const titleMatch = normalize(disease.title).includes(q);
      const keywordMatch = disease.keywords.some(k => normalize(k).includes(q) || q.includes(normalize(k)));
      const categoryMatch = normalize(disease.category).includes(q);
      return titleMatch || keywordMatch || categoryMatch;
    });

    searchResultsSection.classList.remove('hidden');
    renderResults(results, query);
  }

  function renderResults(results, query) {
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="text-muted">Không tìm thấy kết quả phù hợp.</p>';
      return;
    }

    results.forEach(disease => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div>
          <div class="result-title">${disease.title}</div>
          <small class="text-muted">${disease.category}</small>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:#9ca3af"></i>
      `;
      card.addEventListener('click', () => openDisease(disease));
      resultsContainer.appendChild(card);
    });
  }

  searchInput.addEventListener('input', () => {
    handleSearch(searchInput.value);
  });

  // =================== VOICE SEARCH ===================
  function initVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      btnVoiceSearch.title = 'Trình duyệt của bạn không hỗ trợ giọng nói';
      btnVoiceSearch.style.opacity = '0.4';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let listening = false;

    btnVoiceSearch.addEventListener('click', () => {
      if (listening) return;
      listening = true;
      recognition.start();
      btnVoiceSearch.innerHTML = '<i class="fa-solid fa-circle-dot" style="color:red;animation:blink 1s infinite"></i>';
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      handleSearch(transcript);
    };

    recognition.onend = () => {
      listening = false;
      btnVoiceSearch.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    };

    recognition.onerror = (event) => {
      listening = false;
      btnVoiceSearch.innerHTML = '<i class="fa-solid fa-microphone"></i>';
      console.log('Voice recognition error: ', event.error);
    };
  }

  initVoiceSearch();

  // =================== DISEASE DETAIL ===================
  function openDisease(disease) {
    detailTitle.textContent = disease.title;
    detailCategory.textContent = disease.category;

    if (disease.treatment.image) {
      detailImage.src = disease.treatment.image;
      detailImage.classList.remove('hidden');
      detailImage.onerror = function() { this.classList.add('hidden'); };
    } else {
      detailImage.classList.add('hidden');
    }

    detailInstruction.innerHTML = disease.treatment.instructions;
    detailNotes.innerHTML = disease.symptoms || '<p class="text-muted">Chưa có thông tin.</p>';

    // Videos
    renderVideos(disease.videos);

    switchView('view-detail');
    document.querySelector('.app-main').scrollTop = 0;
  }

  function renderVideos(videos) {
    detailVideos.innerHTML = '';

    const count = 3;
    for (let i = 0; i < count; i++) {
      const slot = document.createElement('div');
      if (videos && videos[i]) {
        // Render iframe embed
        const videoId = extractYoutubeId(videos[i]);
        if (videoId) {
          slot.className = 'video-embed';
          slot.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
        } else {
          slot.className = 'video-placeholder';
          slot.innerHTML = `<span>Video ${i + 1}</span>`;
        }
      } else {
        slot.className = 'video-placeholder';
        slot.innerHTML = `<span>Video ${i + 1} (chưa có link)</span>`;
      }
      detailVideos.appendChild(slot);
    }
  }

  function extractYoutubeId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  }

  // =================== TEXT TO SPEECH ===================
  let utterance = null;
  let isSpeaking = false;

  function getPlainText(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || d.innerText || '';
  }

  btnReadInstruction.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ đọc giọng nói.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      btnReadInstruction.innerHTML = '<i class="fa-solid fa-volume-high"></i> Nghe';
      return;
    }

    const text = getPlainText(detailInstruction.innerHTML);
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      isSpeaking = false;
      btnReadInstruction.innerHTML = '<i class="fa-solid fa-volume-high"></i> Nghe';
    };

    isSpeaking = true;
    btnReadInstruction.innerHTML = '<i class="fa-solid fa-stop"></i> Dừng';
    window.speechSynthesis.speak(utterance);
  });

  // =================== ACCORDION ===================
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        const content = this.nextElementSibling;

        this.setAttribute('aria-expanded', !expanded);

        if (!expanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
    });
  }

  initAccordions();

  // =================== INIT ===================
  renderTags();
});
"""

with open(r"d:\@Online-2024\App-VNDULP2026LPL\vndulp2026lpl\js\app.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
print("Updated app.js")
