// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  // =================== UTILS ===================
  // Normalize Vietnamese to no-diacritics latin for fuzzy search
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function levenshtein(a, b) {
    if (a === b) return 0
    if (!a.length) return b.length
    if (!b.length) return a.length

    const matrix = Array.from({ length: a.length + 1 }, () =>
      new Array(b.length + 1).fill(0),
    )

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost,
        )
      }
    }

    return matrix[a.length][b.length]
  }

  function similarity(a, b) {
    if (!a || !b) return 0
    if (a === b) return 1
    const dist = levenshtein(a, b)
    const maxLen = Math.max(a.length, b.length)
    return maxLen ? 1 - dist / maxLen : 0
  }

  // =================== ELEMENTS ===================
  const views = document.querySelectorAll('.view')
  const navItems = document.querySelectorAll('.nav-item')
  const btnBack = document.getElementById('btn-back')
  const btnInfo = document.getElementById('btn-info')
  const appBrand = document.querySelector('.app-brand')
  const appTitle = document.getElementById('app-title')
  const searchInput = document.getElementById('search-input')
  const btnVoiceSearch = document.getElementById('btn-voice-search')
  const btnClearSearch = document.getElementById('btn-clear-search')
  const btnCloseSearch = document.getElementById('btn-close-search')
  const searchOverlay = document.getElementById('search-overlay')
  const tagsContainer = document.getElementById('tags-container')
  const searchSuggestionSection = document.getElementById(
    'search-suggestion-section',
  )
  const searchSuggestionContainer = document.getElementById(
    'search-suggestion-container',
  )
  const searchResultsSection = document.getElementById('search-results-section')
  const resultsContainer = document.getElementById('results-container')
  const diagramTabs = document.getElementById('diagram-tabs')
  const diagramGallery = document.getElementById('diagram-gallery')
  const diagramEmpty = document.getElementById('diagram-empty')

  // Detail
  const detailTitle = document.getElementById('detail-title')
  const detailCategory = document.getElementById('detail-category')
  const detailMediaList = document.getElementById('detail-media-list')
  const detailImagePlaceholder = document.getElementById(
    'detail-image-placeholder',
  )
  const detailInstruction = document.getElementById('detail-instruction')
  const detailNotes = document.getElementById('detail-notes')
  const detailVideos = document.getElementById('detail-videos')
  const btnReadInstruction = document.getElementById('btn-read-instruction')

  // =================== VIEW SWITCH ===================
  let previousView = 'view-home'
  let currentView = 'view-home'
  let activeDiagramSectionId = null

  const navHome = document.querySelector('.nav-item[data-target="view-home"]')

  function clearSearchSuggestions() {
    if (searchSuggestionContainer) {
      searchSuggestionContainer.innerHTML = ''
    }
    if (searchSuggestionSection) {
      searchSuggestionSection.classList.add('hidden')
    }
  }

  function renderSearchSuggestions(query, suggestions) {
    if (!searchSuggestionContainer || !searchSuggestionSection) return

    if (!suggestions.length) {
      clearSearchSuggestions()
      return
    }

    searchSuggestionContainer.innerHTML = ''
    const suggestBox = document.createElement('div')
    suggestBox.className = 'search-suggestion-box'

    const title = document.createElement('p')
    title.className = 'search-suggestion-title'
    title.textContent = `Có phải bạn muốn tìm: "${query}"?`
    suggestBox.appendChild(title)

    const list = document.createElement('div')
    list.className = 'search-suggestion-list'
    suggestions.forEach((term) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'suggestion-chip'
      btn.textContent = term
      btn.addEventListener('click', () => {
        searchInput.value = term
        handleSearch(term)
        searchResultsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
      list.appendChild(btn)
    })

    suggestBox.appendChild(list)
    searchSuggestionContainer.appendChild(suggestBox)
    searchSuggestionSection.classList.remove('hidden')
  }

  function switchView(targetId) {
    views.forEach((v) => v.classList.add('hidden'))
    const target = document.getElementById(targetId)
    if (target) {
      target.classList.remove('hidden')
      target.style.animation = 'none'
      target.offsetHeight
      target.style.animation = ''
    }

    previousView = currentView
    currentView = targetId

    if (targetId === 'view-detail') {
      btnBack.classList.remove('hidden')
      appTitle.textContent = 'Chi tiết bệnh'
      navHome && navHome.classList.add('nav-hint')
    } else {
      btnBack.classList.add('hidden')
      appTitle.textContent = 'Đồng Ứng Liệu Pháp'
      navHome && navHome.classList.remove('nav-hint')
    }

    if (targetId === 'view-home') {
      clearSearchSuggestions()
    }

    if (targetId === 'view-dohinh') {
      renderDiagramView()
    }

    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.target === targetId)
    })
  }

  // Nav
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      switchView(item.dataset.target)
    })
  })

  btnBack.addEventListener('click', () => {
    switchView(previousView || 'view-home')
  })

  btnInfo.addEventListener('click', () => {
    switchView('view-about')
  })

  if (appBrand) {
    appBrand.addEventListener('click', () => {
      switchView('view-home')
    })
  }

  // =================== KHẨU QUYẾT / KIM NGÔN ===================
  // ĐÁNH DẤU CHO BẠN: Bạn có thể thêm, sửa, hoặc xóa các câu ở định dạng bên dưới nhé.
  const inspirationalQuotes = [
    "Không có Bác sĩ nào giỏi bằng Cơ thể của Chúng ta.",
    "Đồng mà Ứng thì dùng, Đồng mà Không Ứng thì không dùng.",
    "Đau trên chỉnh dưới, đau trong chữa ngoài, đau lớn chữa nhỏ.",
    "Bệnh do Tâm sinh, chữa bệnh phải chữa cả Tâm.",
    "Con Mắt thuộc Tâm",
    "Hình đồng Hình, Thế đồng Thế, Thể đồng Thể",
    // Bạn hãy chép thêm câu mới vào đây, ví dụ:
    // "Câu nói hay tiếp theo của bạn.",
  ]

  const quoteTextElement = document.getElementById('daily-quote-text')

  function initDynamicQuotes() {
    if (!quoteTextElement) return

    let currentIndex = Math.floor(Math.random() * inspirationalQuotes.length)
    quoteTextElement.textContent = inspirationalQuotes[currentIndex]
    quoteTextElement.classList.add('fade-in')

    // Chuyển đổi định kỳ mỗi 8 giây
    setInterval(() => {
      // 1. Zoom/Fade out
      quoteTextElement.classList.remove('fade-in')
      quoteTextElement.classList.add('fade-out')

      // 2. Chờ hiệu ứng mờ xong (khoảng 600ms) rồi mới đổi chữ
      setTimeout(() => {
        let newIndex = currentIndex
        // Đảm bảo không random trúng dòng hiện tại nếu có hơn 1 câu
        if (inspirationalQuotes.length > 1) {
          while (newIndex === currentIndex) {
            newIndex = Math.floor(Math.random() * inspirationalQuotes.length)
          }
        }
        currentIndex = newIndex
        quoteTextElement.textContent = inspirationalQuotes[currentIndex]

        // 3. Zoom/Fade in câu mới
        quoteTextElement.classList.remove('fade-out')
        quoteTextElement.classList.add('fade-in')
      }, 600)
    }, 8000)
  }

  // =================== TAGS ===================
  function renderTags() {
    tagsContainer.innerHTML = ''
    appData.popularTags.forEach((tagObj) => {
      const chip = document.createElement('button')
      chip.className = 'tag-chip'
      chip.innerHTML = `<span class="tag-icon">${tagObj.icon}</span><span>${tagObj.text}</span>`
      chip.addEventListener('click', () => {
        if (isDraggingTags) return // Ngăn click nếu đang lướt kéo chuột
        searchInput.value = tagObj.text
        handleSearch(tagObj.text)
        searchResultsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
      tagsContainer.appendChild(chip)
    })
  }

  // Cho phép dùng chuột kéo cuộn ngang trên PC
  let isDownTags = false
  let startXTags
  let scrollLeftTags
  let isDraggingTags = false

  tagsContainer.addEventListener('mousedown', (e) => {
    isDownTags = true
    isDraggingTags = false
    tagsContainer.style.cursor = 'grabbing'
    startXTags = e.pageX - tagsContainer.offsetLeft
    scrollLeftTags = tagsContainer.scrollLeft
  })
  tagsContainer.addEventListener('mouseleave', () => {
    isDownTags = false
    tagsContainer.style.cursor = 'auto'
  })
  tagsContainer.addEventListener('mouseup', () => {
    isDownTags = false
    tagsContainer.style.cursor = 'auto'
    // Cần 1 chút timeout để ngăn sự kiện click kịch hoạt liền sau khi drag
    setTimeout(() => {
      isDraggingTags = false
    }, 50)
  })
  tagsContainer.addEventListener('mousemove', (e) => {
    if (!isDownTags) return
    e.preventDefault()
    isDraggingTags = true
    const x = e.pageX - tagsContainer.offsetLeft
    const walk = (x - startXTags) * 2 // Tốc độ lướt
    tagsContainer.scrollLeft = scrollLeftTags - walk
  })

  // =================== SEARCH ===================
  function rankDisease(disease, q) {
    const fields = [
      normalize(disease.title),
      normalize(disease.category),
      ...disease.keywords.map((k) => normalize(k)),
    ].filter(Boolean)

    let best = 0
    fields.forEach((field) => {
      if (field === q) {
        best = Math.max(best, 100)
        return
      }
      const regex = new RegExp('(^|\\s)' + q + '(\\s|$)')
      if (regex.test(field)) {
        best = Math.max(best, 50)
        return
      }
      if (field.startsWith(q)) {
        best = Math.max(best, 20)
        return
      }
      if (field.includes(q)) {
        best = Math.max(best, 10)
        return
      }
      if (q.includes(field)) {
        best = Math.max(best, 5)
        return
      }
      const direct = similarity(q, field)
      best = Math.max(best, direct)

      field.split(' ').forEach((token) => {
        if (token.length < 3) return
        best = Math.max(best, similarity(q, token))
      })
    })

    return best
  }

  function getFuzzyResults(q) {
    const threshold = q.length <= 4 ? 0.68 : 0.58
    return appData.diseases
      .map((disease) => ({ disease, score: rankDisease(disease, q) }))
      .filter((item) => item.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.disease)
  }

  function getSearchSuggestions(q) {
    if (q.length < 3) return []

    const corpus = [
      ...new Set([
        ...appData.popularTags.map((t) => t.text),
        ...appData.diseases.map((d) => d.title),
      ]),
    ]

    return corpus
      .map((term) => {
        const norm = normalize(term)
        let score = similarity(q, norm)

        if (norm.includes(q) || q.includes(norm)) {
          score = Math.max(score, 0.95)
        }

        return { term, score }
      })
      .filter((item) => item.score >= 0.55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.term)
  }

  function handleSearch(query) {
    const q = normalize(query)

    if (!q) {
      clearSearchSuggestions()
      searchResultsSection.classList.add('hidden')
      return
    }

    const merged = getFuzzyResults(q)

    const suggestions = getSearchSuggestions(q)
    const shouldShowSuggestion = merged.length === 0

    if (shouldShowSuggestion) {
      renderSearchSuggestions(query.trim(), suggestions)
    } else {
      clearSearchSuggestions()
    }

    searchResultsSection.classList.remove('hidden')
    // CHỈ HIỂN THỊ 7 KẾT QUẢ
    renderResults(merged.slice(0, 7), query)
  }

  function renderResults(results) {
    resultsContainer.innerHTML = ''

    if (results.length === 0) {
      resultsContainer.innerHTML =
        '<p class="text-muted">Không tìm thấy kết quả phù hợp.</p>'
      return
    }

    results.forEach((disease) => {
      const card = document.createElement('div')
      card.className = 'result-card'
      card.innerHTML = `
        <div>
          <div class="result-title">${disease.title}</div>
          <small class="text-muted">${disease.category}</small>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:#9ca3af"></i>
      `
      card.addEventListener('click', () => {
        openDisease(disease)
        deactivateSearchMode()
      })
      resultsContainer.appendChild(card)
    })
  }

  // =================== PRO SEARCH MODE ===================
  function activateSearchMode() {
    document.body.classList.add('search-active')
    searchOverlay.classList.remove('hidden')
    void searchOverlay.offsetWidth // Trigger reflow
    searchOverlay.classList.add('active')
    btnCloseSearch.classList.remove('hidden')
    document.querySelector('.app-main').scrollTop = 0
  }

  function deactivateSearchMode() {
    document.body.classList.remove('search-active')
    searchOverlay.classList.remove('active')
    setTimeout(() => {
      searchOverlay.classList.add('hidden')
    }, 300)
    btnCloseSearch.classList.add('hidden')
    searchInput.blur()
  }

  searchInput.addEventListener('focus', activateSearchMode)
  btnCloseSearch.addEventListener('click', deactivateSearchMode)
  searchOverlay.addEventListener('click', deactivateSearchMode)

  searchInput.addEventListener('input', () => {
    const val = searchInput.value
    if (val.trim().length > 0) {
      btnClearSearch.classList.remove('hidden')
      btnVoiceSearch.classList.add('hidden')
    } else {
      btnClearSearch.classList.add('hidden')
      btnVoiceSearch.classList.remove('hidden')
    }
    handleSearch(val)
  })

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = ''
    btnClearSearch.classList.add('hidden')
    btnVoiceSearch.classList.remove('hidden')
    handleSearch('')
    searchInput.focus()
  })

  // =================== VOICE SEARCH ===================
  function initVoiceSearch() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      btnVoiceSearch.title = 'Trình duyệt của bạn không hỗ trợ giọng nói'
      btnVoiceSearch.style.opacity = '0.4'
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'vi-VN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    let listening = false

    btnVoiceSearch.addEventListener('click', () => {
      if (listening) return
      listening = true
      recognition.start()
      btnVoiceSearch.innerHTML =
        '<i class="fa-solid fa-circle-dot" style="color:red;animation:blink 1s infinite"></i>'
    })

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      searchInput.value = transcript
      handleSearch(transcript)
    }

    recognition.onend = () => {
      listening = false
      btnVoiceSearch.innerHTML = '<i class="fa-solid fa-microphone"></i>'
    }

    recognition.onerror = (event) => {
      listening = false
      btnVoiceSearch.innerHTML = '<i class="fa-solid fa-microphone"></i>'
      console.log('Voice recognition error: ', event.error)
    }
  }

  initVoiceSearch()

  // =================== DISEASE DETAIL ===================
  function getTreatmentMedia(disease) {
    if (
      Array.isArray(disease.treatment.media) &&
      disease.treatment.media.length
    ) {
      return disease.treatment.media
    }

    if (disease.treatment.image) {
      return [
        {
          src: disease.treatment.image,
          caption: disease.title,
        },
      ]
    }

    return []
  }

  function renderTreatmentMedia(mediaItems) {
    detailMediaList.innerHTML = ''

    if (!mediaItems.length) {
      detailImagePlaceholder.classList.remove('hidden')
      return
    }

    detailImagePlaceholder.classList.add('hidden')

    mediaItems.forEach((item) => {
      const figure = document.createElement('figure')
      figure.className = 'media-item'

      const image = document.createElement('img')
      image.src = item.src
      image.alt = item.caption || detailTitle.textContent
      image.loading = 'lazy'

      image.addEventListener('error', () => {
        figure.remove()
        if (!detailMediaList.children.length) {
          detailImagePlaceholder.classList.remove('hidden')
        }
      })

      const caption = document.createElement('figcaption')
      caption.textContent = item.caption || detailTitle.textContent

      figure.appendChild(image)
      figure.appendChild(caption)
      detailMediaList.appendChild(figure)
    })
  }

  function openDisease(disease) {
    detailTitle.textContent = disease.title
    detailCategory.textContent = disease.category

    renderTreatmentMedia(getTreatmentMedia(disease))

    detailInstruction.innerHTML = disease.treatment.instructions
    detailNotes.innerHTML =
      disease.symptoms || '<p class="text-muted">Chưa có thông tin.</p>'

    // Videos
    renderVideos(disease.videos)

    switchView('view-detail')
    document.querySelector('.app-main').scrollTop = 0
  }

  function renderVideos(videos) {
    detailVideos.innerHTML = ''

    const count = 3
    for (let i = 0; i < count; i++) {
      const slot = document.createElement('div')
      if (videos && videos[i]) {
        // Render iframe embed
        const videoId = extractYoutubeId(videos[i])
        if (videoId) {
          slot.className = 'video-embed'
          slot.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen loading="lazy"></iframe>`
        } else {
          slot.className = 'video-placeholder'
          slot.innerHTML = `<span>Video ${i + 1}</span>`
        }
      } else {
        slot.className = 'video-placeholder'
        slot.innerHTML = `<span>Video ${i + 1} (chưa có link)</span>`
      }
      detailVideos.appendChild(slot)
    }
  }

  function extractYoutubeId(url) {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    )
    return match ? match[1] : null
  }

  // =================== DIAGRAM VIEW ===================
  function getDiagramSections() {
    if (!Array.isArray(appData.diagramSections)) {
      return []
    }

    return appData.diagramSections.filter((section) => {
      return section && section.id && Array.isArray(section.items)
    })
  }

  function renderDiagramItems(items) {
    diagramGallery.innerHTML = ''

    if (!items.length) {
      diagramEmpty.classList.remove('hidden')
      return
    }

    diagramEmpty.classList.add('hidden')

    // Grouping logic for 98 images into accordion
    const groups = {
      'Nhóm Đầu & Mặt': [],
      'Nhóm Bàn Tay & Cánh Tay': [],
      'Nhóm Bàn Chân & Cẳng Chân': [],
      'Nhóm Thân & Nội Tạng': [],
      'Nhóm Khác': []
    }

    items.forEach(item => {
      const t = (item.caption || '').toLowerCase()
      if (t.includes('mặt') || t.includes('não') || t.includes('tai')) {
         groups['Nhóm Đầu & Mặt'].push(item)
      } else if (t.includes('tay')) {
         groups['Nhóm Bàn Tay & Cánh Tay'].push(item)
      } else if (t.includes('chân')) {
         groups['Nhóm Bàn Chân & Cẳng Chân'].push(item)
      } else if (t.includes('thân') || t.includes('lưng') || t.includes('bụng') || t.includes('ngực')) {
         groups['Nhóm Thân & Nội Tạng'].push(item)
      } else {
         groups['Nhóm Khác'].push(item)
      }
    })

    // If there is only 1 group with items (like the tabs Ly thuyet, thao tac), don't show accordion
    const activeGroups = Object.entries(groups).filter(g => g[1].length > 0)
    if (activeGroups.length === 1 || items.length < 20) {
       // Render normally
       items.forEach(item => {
          const figure = createFigure(item)
          diagramGallery.appendChild(figure)
       })
       return
    }

    activeGroups.forEach(([gName, gItems]) => {
       const details = document.createElement('details')
       details.className = 'diagram-accordion'
       // open the first group by default
       if (gName === activeGroups[0][0]) details.open = true 
       
       const summary = document.createElement('summary')
       summary.textContent = gName + ' (' + gItems.length + ')'
       details.appendChild(summary)
       
       const grid = document.createElement('div')
       grid.className = 'diagram-accordion-grid'
       
       gItems.forEach(item => {
          grid.appendChild(createFigure(item))
       })
       
       details.appendChild(grid)
       diagramGallery.appendChild(details)
    })
  }

  function createFigure(item) {
      const figure = document.createElement('figure')
      figure.className = 'diagram-card'

      const image = document.createElement('img')
      image.src = item.src
      image.alt = item.caption || 'Đồ hình'
      image.loading = 'lazy'
      image.addEventListener('error', () => {
        figure.remove()
        if (!diagramGallery.children.length) {
          diagramEmpty.classList.remove('hidden')
        }
      })

      const caption = document.createElement('figcaption')
      caption.textContent = item.caption || 'Không có chú thích'

      figure.appendChild(image)
      figure.appendChild(caption)
      return figure
  }

  function renderDiagramView() {
    if (!diagramTabs || !diagramGallery || !diagramEmpty) {
      return
    }

    const sections = getDiagramSections()
    diagramTabs.innerHTML = ''

    if (!sections.length) {
      diagramGallery.innerHTML = ''
      diagramEmpty.classList.remove('hidden')
      return
    }

    const hasActiveSection = sections.some(
      (section) => section.id === activeDiagramSectionId,
    )
    if (!hasActiveSection) {
      activeDiagramSectionId = sections[0].id
    }

    sections.forEach((section) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'diagram-tab'
      button.textContent = `${section.title} (${section.items.length})`
      button.setAttribute('aria-pressed', section.id === activeDiagramSectionId)
      button.classList.toggle('active', section.id === activeDiagramSectionId)

      button.addEventListener('click', () => {
        activeDiagramSectionId = section.id
        renderDiagramView()
      })

      diagramTabs.appendChild(button)
    })

    const selectedSection =
      sections.find((section) => section.id === activeDiagramSectionId) ||
      sections[0]
    renderDiagramItems(selectedSection.items)
  }

  // =================== TEXT TO SPEECH ===================
  let utterance = null
  let isSpeaking = false

  function getPlainText(html) {
    const d = document.createElement('div')
    d.innerHTML = html
    return d.textContent || d.innerText || ''
  }

  btnReadInstruction.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ đọc giọng nói.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      isSpeaking = false
      btnReadInstruction.innerHTML =
        '<i class="fa-solid fa-volume-high"></i> Nghe'
      return
    }

    const text = getPlainText(detailInstruction.innerHTML)
    utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.rate = 0.85
    utterance.pitch = 1

    // Auto-select voice: prefer female Vi, then male Vi, then any Vi
    const allVoices = window.speechSynthesis.getVoices()
    const viVoices = allVoices.filter((v) => v.lang.startsWith('vi'))
    const femaleVoice = viVoices.find((v) =>
      /female|nu|woman|girl/i.test(v.name),
    )
    const maleVoice = viVoices.find((v) => /male|nam|man|boy/i.test(v.name))
    const selectedVoice = femaleVoice || maleVoice || viVoices[0] || null
    if (selectedVoice) utterance.voice = selectedVoice

    utterance.onend = () => {
      isSpeaking = false
      btnReadInstruction.innerHTML =
        '<i class="fa-solid fa-volume-high"></i> Nghe'
    }

    isSpeaking = true
    btnReadInstruction.innerHTML = '<i class="fa-solid fa-stop"></i> Dừng'
    window.speechSynthesis.speak(utterance)
  })

  // =================== ACCORDION ===================
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach((header) => {
      header.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true'
        const content = this.nextElementSibling

        this.setAttribute('aria-expanded', !expanded)

        if (!expanded) {
          content.style.maxHeight = content.scrollHeight + 'px'
        } else {
          content.style.maxHeight = '0'
        }
      })
    })
  }

  initAccordions()

  // =================== INIT ===================
  initDynamicQuotes()
  renderTags()
  renderDiagramView()
})
