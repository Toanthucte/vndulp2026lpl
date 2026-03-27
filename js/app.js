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
  const appTitle = document.getElementById('app-title')
  const searchInput = document.getElementById('search-input')
  const btnVoiceSearch = document.getElementById('btn-voice-search')
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

  // =================== TAGS ===================
  function renderTags() {
    tagsContainer.innerHTML = ''
    appData.popularTags.forEach((tag) => {
      const chip = document.createElement('button')
      chip.className = 'tag-chip'
      chip.textContent = tag
      chip.addEventListener('click', () => {
        searchInput.value = tag
        handleSearch(tag)
        searchResultsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
      tagsContainer.appendChild(chip)
    })
  }

  // =================== SEARCH ===================
  function rankDisease(disease, q) {
    const fields = [
      normalize(disease.title),
      normalize(disease.category),
      ...disease.keywords.map((k) => normalize(k)),
    ].filter(Boolean)

    let best = 0
    fields.forEach((field) => {
      if (field.includes(q) || q.includes(field)) {
        best = Math.max(best, 1)
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
        ...appData.popularTags,
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

    const results = appData.diseases.filter((disease) => {
      const titleMatch = normalize(disease.title).includes(q)
      const keywordMatch = disease.keywords.some(
        (k) => normalize(k).includes(q) || q.includes(normalize(k)),
      )
      const categoryMatch = normalize(disease.category).includes(q)
      return titleMatch || keywordMatch || categoryMatch
    })

    const fuzzyResults = getFuzzyResults(q)
    const merged = [...results]
    fuzzyResults.forEach((disease) => {
      if (!merged.some((item) => item.id === disease.id)) {
        merged.push(disease)
      }
    })

    const suggestions = getSearchSuggestions(q)
    const shouldShowSuggestion = results.length === 0

    if (shouldShowSuggestion) {
      renderSearchSuggestions(query.trim(), suggestions)
    } else {
      clearSearchSuggestions()
    }

    searchResultsSection.classList.remove('hidden')
    renderResults(merged.slice(0, 20), query)
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
      card.addEventListener('click', () => openDisease(disease))
      resultsContainer.appendChild(card)
    })
  }

  searchInput.addEventListener('input', () => {
    handleSearch(searchInput.value)
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

    items.forEach((item) => {
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
      diagramGallery.appendChild(figure)
    })
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
  renderTags()
  renderDiagramView()
})
