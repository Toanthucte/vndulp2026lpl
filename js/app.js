// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  // Quản lý Trạng thái Âm thanh
  let isSoundMuted = localStorage.getItem('app_sound_muted') === 'true'
  const btnSoundToggle = document.getElementById('btn-sound-toggle')

  function updateSoundIcon() {
    const icon = btnSoundToggle.querySelector('i')
    if (isSoundMuted) {
      icon.className = 'fas fa-volume-mute'
      btnSoundToggle.classList.add('muted')
    } else {
      icon.className = 'fas fa-volume-up'
      btnSoundToggle.classList.remove('muted')
    }
  }

  updateSoundIcon() // Khởi tạo icon ban đầu

  btnSoundToggle.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted
    localStorage.setItem('app_sound_muted', isSoundMuted)
    updateSoundIcon()
  })

  // Âm thanh Game
  const sounds = {
    correct: new Audio('./assets/sounds/quiz-correct.mp3'),
    wrong: new Audio('./assets/sounds/quiz-incorrect.mp3'),
    complete: new Audio('./assets/sounds/quiz-complete.mp3'),
  }

  function playSound(type) {
    // Haptic Feedback (Rung vật lý) kết hợp cùng âm thanh
    if (navigator.vibrate) {
      if (type === 'correct') {
        navigator.vibrate(50) // Rung nhẹ một nhịp khi đúng
      } else if (type === 'wrong') {
        navigator.vibrate([50, 100, 50]) // Rung nhắc nhở (2 nhịp ngắn) khi sai
      } else if (type === 'complete') {
        navigator.vibrate([100, 50, 100, 50, 100]) // Rung dài liên tục kiểu pháo hoa chiến thắng
      } else if (type === 'flip') {
        navigator.vibrate(30) // Rung rất cực nhẹ khi lật thẻ
      }
    }

    if (isSoundMuted) return // Bỏ qua nếu đang tắt âm thanh (Rung vẫn hoạt động để đảm bảo trải nghiệm)

    // Âm thanh lật thẻ đặc biệt không khai báo cứng vì chỉ dùng nhẹ
    if (type === 'flip') {
      const flipSound = new Audio('./assets/sounds/card-slide.mp3')
      flipSound.volume = 0.5
      flipSound.play().catch(() => {})
      return
    }

    if (sounds[type]) {
      sounds[type].currentTime = 0
      sounds[type]
        .play()
        .catch((err) => console.log('Audio disabled by browser:', err))
    }
  }

  // Navigation
  const navItems = document.querySelectorAll('.nav-item')
  const views = document.querySelectorAll('.view')

  function switchView(targetId) {
    views.forEach((v) => v.classList.remove('active'))
    document.getElementById(targetId).classList.add('active')

    // Manage App Header logic
    const timerDisplay = document.getElementById('timer-display')
    if (targetId !== 'view-quiz') {
      timerDisplay.classList.add('hidden')
      stopTimer()
    }
  }

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      navItems.forEach((n) => n.classList.remove('active'))
      item.classList.add('active')
      const target = item.getAttribute('data-target')

      if (target === 'view-flashcards-start') {
        initFlashcards()
        switchView('view-flashcards')
      } else {
        switchView(target)
      }
    })
  })

  // ========== HOME / TOPICS ==========
  const topicContainer = document.getElementById('topic-container')
  appData.topics.forEach((topic) => {
    const questionCount = (appData.questions || []).filter(
      (q) => q.topicId === topic.id,
    ).length
    const flashcardCount = (appData.flashcards || []).filter(
      (f) => f.topicId === topic.id,
    ).length

    const card = document.createElement('div')
    card.className = 'topic-card'
    card.style.borderLeft = `5px solid ${topic.accent}`
    card.innerHTML = `
      <h3 style="color:${topic.accent}">${topic.title}</h3>
      <p style="font-size:0.875rem; color:#666; margin-bottom:0.4rem; font-weight:500;">
        ${topic.subject} &bull; ${flashcardCount} thẻ học | ${questionCount} câu hỏi
      </p>
      <p>${topic.summary}</p>
    `
    card.addEventListener('click', () => {
      // Just start flashcard for this topic for simplicity
      initFlashcards(topic.id)
      navItems.forEach((n) => n.classList.remove('active'))
      document
        .querySelector('[data-target="view-flashcards-start"]')
        .classList.add('active')
      switchView('view-flashcards')
    })
    topicContainer.appendChild(card)
  })

  // ========== FLASHCARDS ==========
  let currentCardIndex = 0
  let currentCards = []
  const flashcardInner = document.querySelector('.flashcard-inner')
  const fcFrontContent = document.getElementById('fc-front-text')
  const fcBackContent = document.getElementById('fc-back-text')
  const fcProgress = document.getElementById('fc-progress')
  const fcAssessmentControls = document.getElementById('fc-assessment-controls')
  const btnFcEasy = document.getElementById('btn-fc-easy')
  const btnFcHard = document.getElementById('btn-fc-hard')

  function initFlashcards(topicId = null) {
    if (topicId) {
      currentCards = (appData.flashcards || []).filter(
        (c) => c.topicId === topicId,
      )
    } else {
      currentCards = [...(appData.flashcards || [])]
    }

    // Shuffle
    currentCards.sort(() => Math.random() - 0.5)
    currentCardIndex = 0

    if (currentCards.length > 0) {
      showFlashcard()
    } else {
      fcFrontContent.innerText = 'Chưa có thẻ học nào cho phần này.'
      fcBackContent.innerText = ''
    }
  }

  function showFlashcard() {
    flashcardInner.classList.remove('is-flipped')
    if (fcAssessmentControls) fcAssessmentControls.classList.remove('visible')
    const card = currentCards[currentCardIndex]

    // Small delay to let flip animation resolve before changing text
    setTimeout(() => {
      fcFrontContent.innerHTML = card.front
      fcBackContent.innerHTML = card.back
      fcProgress.innerText = `${currentCardIndex + 1} / ${currentCards.length}`
    }, 200)
  }

  flashcardInner.addEventListener('click', () => {
    playSound('flip')
    const isFlipped = flashcardInner.classList.contains('is-flipped')
    if (isFlipped) {
      flashcardInner.classList.remove('is-flipped')
      if (fcAssessmentControls) fcAssessmentControls.classList.remove('visible')
    } else {
      flashcardInner.classList.add('is-flipped')
      if (fcAssessmentControls) fcAssessmentControls.classList.add('visible')
    }
  })

  function processAssessment(type) {
    if (currentCardIndex < currentCards.length - 1) {
      currentCardIndex++
      showFlashcard()
    } else {
      alert('Đã hoàn thành vòng thẻ học!')
      // Tùy chọn: initFlashcards() lại từ đầu
    }
  }

  if (btnFcEasy)
    btnFcEasy.addEventListener('click', (e) => {
      e.stopPropagation() // Ngăn không cho lật thẻ lại
      processAssessment('easy')
    })
  if (btnFcHard)
    btnFcHard.addEventListener('click', (e) => {
      e.stopPropagation()
      processAssessment('hard')
    })

  document.getElementById('btn-next-card').addEventListener('click', () => {
    if (currentCardIndex < currentCards.length - 1) {
      currentCardIndex++
      showFlashcard()
    } else {
      alert('Đã hoàn thành thẻ học!')
    }
  })

  document.getElementById('btn-prev-card').addEventListener('click', () => {
    if (currentCardIndex > 0) {
      currentCardIndex--
      showFlashcard()
    }
  })

  // ========== QUIZ ==========
  let quizQuestions = []
  let userAnswers = []
  let currentQuizIndex = 0
  let score = 0
  let quizTimerInterval
  let timeRemaining = 0

  const quizSetupForm = document.getElementById('quiz-setup-form')
  const quizProgressFill = document.getElementById('quiz-progress-fill')
  const quizCurrentNum = document.getElementById('quiz-current-num')
  const quizQuestionText = document.getElementById('quiz-question-text')
  const quizOptions = document.getElementById('quiz-options')

  quizSetupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const timeLimit = parseInt(document.getElementById('quiz-time').value) * 60
    let count = parseInt(document.getElementById('quiz-count').value)

    quizQuestions = [...(appData.questions || [])]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
    currentQuizIndex = 0
    score = 0
    timeRemaining = timeLimit

    switchView('view-quiz')
    document.getElementById('timer-display').classList.remove('hidden')
    startTimer()
    showQuizQuestion()
  })

  function startTimer() {
    updateTimerDisplay()
    quizTimerInterval = setInterval(() => {
      timeRemaining--
      updateTimerDisplay()
      if (timeRemaining <= 0) {
        stopTimer()
        endQuiz(true) // Time's up
      }
    }, 1000)
  }

  function stopTimer() {
    clearInterval(quizTimerInterval)
  }

  function updateTimerDisplay() {
    const m = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, '0')
    const s = (timeRemaining % 60).toString().padStart(2, '0')
    document.getElementById('timer-display').innerText = `${m}:${s}`
  }

  function showQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
      endQuiz()
      return
    }

    const q = quizQuestions[currentQuizIndex]
    quizProgressFill.style.width = `${(currentQuizIndex / quizQuestions.length) * 100}%`
    quizCurrentNum.innerText = `Câu ${currentQuizIndex + 1} / ${quizQuestions.length}`
    quizQuestionText.innerText = q.prompt || q.question

    quizOptions.innerHTML = ''

    if (q.type === 'statement_count') {
      quizQuestionText.innerHTML = q.prompt
      renderStatementCountQuestion(q)
    } else if (q.type === 'true_false') {
      quizQuestionText.innerHTML = q.prompt
      renderTrueFalseQuestion(q)
    } else if (q.type === 'equation_fill') {
      quizQuestionText.innerHTML = q.prompt || q.question
      renderEquationFillQuestion(q)
    } else if (q.type === 'sentence_builder') {
      quizQuestionText.innerHTML = q.prompt
      renderSentenceBuilderQuestion(q)
    } else if (q.type === 'fill_blank') {
      quizQuestionText.innerHTML = ''
      renderFillBlankQuestion(q)
    } else {
      // Clone and shuffle options so answer isn't always at same spot
      const options = [...q.options].sort(() => Math.random() - 0.5)

      options.forEach((opt) => {
        const btn = document.createElement('button')
        btn.className = 'option-btn'
        btn.innerText = opt
        btn.addEventListener('click', () =>
          handleOptionSelect(btn, opt, q.answer),
        )
        quizOptions.appendChild(btn)
      })
    }
  }

  function handleOptionSelect(btnElement, selectedOpt, correctOpt) {
    const allBtns = quizOptions.querySelectorAll('.option-btn')
    allBtns.forEach((b) => (b.disabled = true))
    userAnswers.push({
      q: quizQuestions[currentQuizIndex].prompt,
      options: quizQuestions[currentQuizIndex].options,
      ans: correctOpt,
      sel: selectedOpt,
    })

    if (selectedOpt === correctOpt) {
      playSound('correct')
      btnElement.classList.add('correct')
      score++
    } else {
      playSound('wrong')
      btnElement.classList.add('wrong')
      btnElement.classList.add('shake')
      // Highlight correct option
      allBtns.forEach((b) => {
        if (b.innerText === correctOpt) b.classList.add('correct')
      })
    }

    // "1 cháº¡m qua bÃ i" - sau khi tá»± Ä‘á»™ng hiá»‡n káº¿t quáº£, chá» 1.5s nháº£y qua cÃ¢u tiáº¿p theo
    setTimeout(() => {
      currentQuizIndex++
      showQuizQuestion()
    }, 1500)
  }

  function renderStatementCountQuestion(q) {
    let html = `
      <div class="sc-hint">
        <span style="font-size: 1.2rem; margin-right: 5px;">✍️</span> 
        <strong>Mẹo làm bài:</strong> Hãy tick (☑️) vào các phát biểu mà em cho là <strong>ĐÚNG</strong> ở bên dưới để đếm số lượng, sau đó chốt chọn 1 đáp án A, B, C, D hợp lý nhất nhé!
      </div>
      <div class="sc-list">
    `

    q.statements.forEach((stmt, i) => {
      html += `
          <div class="sc-item" data-index="${i}">
            <input type="checkbox" class="sc-checkbox" id="sc-check-${i}">
            <label for="sc-check-${i}" class="sc-label">${stmt}</label>
          </div>
        `
    })

    html += `</div><div class="sc-options-container" id="sc-options-container"></div>`
    quizOptions.innerHTML = html

    const scOptionsContainer = document.getElementById('sc-options-container')
    const options = [...q.options]

    // Interaction trick for checkboxes
    const checkboxes = document.querySelectorAll('.sc-checkbox')
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', () => {
        const checkedCount = document.querySelectorAll(
          '.sc-checkbox:checked',
        ).length
        const items = document.querySelectorAll('.sc-item')

        // Highlight the selected row slightly
        items.forEach((item, index) => {
          if (document.getElementById(`sc-check-${index}`).checked) {
            item.classList.add('checked-row')
          } else {
            item.classList.remove('checked-row')
          }
        })
      })
    })

    // The actual buttons to submit the answer uses the same array
    options.forEach((opt) => {
      const btn = document.createElement('button')
      btn.className = 'option-btn'
      btn.innerText = opt

      btn.addEventListener('click', () => {
        // Disable drafts after selecting final answer
        document
          .querySelectorAll('.sc-checkbox')
          .forEach((cb) => (cb.disabled = true))
        handleOptionSelect(btn, opt, q.answer)
      })
      scOptionsContainer.appendChild(btn)
    })
  }

  function renderTrueFalseQuestion(q) {
    let html = '<div class="tf-container">'
    q.statements.forEach((stmt, i) => {
      html += `
        <div class="tf-statement" id="stmt-${i}">
          <div class="tf-text">${i + 1}. ${stmt.text}</div>
          <div class="tf-btn-group">
            <button class="tf-btn tf-true" data-index="${i}" data-val="true">Đúng</button>
            <button class="tf-btn tf-false" data-index="${i}" data-val="false">Sai</button>
          </div>
          <div class="tf-feedback hidden" id="feedback-${i}"></div>
        </div>
      `
    })
    html += `<button class="tf-submit-btn" id="tf-submit" disabled>Kiểm tra đáp án</button></div>`

    quizOptions.innerHTML = html

    const userChoices = new Array(q.statements.length).fill(null)
    const submitBtn = document.getElementById('tf-submit')

    document.querySelectorAll('.tf-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index)
        const val = e.target.dataset.val === 'true'

        // Remove active class from buttons in this group
        const group = e.target.closest('.tf-btn-group')
        group
          .querySelectorAll('.tf-btn')
          .forEach((b) => b.classList.remove('active'))

        // Add active class to clicked button
        e.target.classList.add('active')

        userChoices[index] = val

        // Check if all are answered to enable submit
        if (userChoices.every((c) => c !== null)) {
          submitBtn.removeAttribute('disabled')
        }
      })
    })

    submitBtn.addEventListener('click', () => {
      // Disable buttons
      document
        .querySelectorAll('.tf-btn')
        .forEach((b) => (b.style.pointerEvents = 'none'))
      submitBtn.style.display = 'none' // hide submit

      let allCorrect = true

      q.statements.forEach((stmt, i) => {
        const stmtEl = document.getElementById(`stmt-${i}`)
        const feedbackEl = document.getElementById(`feedback-${i}`)

        const isCorrect = userChoices[i] === stmt.answer
        if (!isCorrect) allCorrect = false

        if (isCorrect) {
          stmtEl.classList.add('correct')
        } else {
          stmtEl.classList.add('incorrect')
          stmtEl.classList.add('shake')
        }

        // Show explanation for false answers or when user missed it
        if (stmt.explanation && (!isCorrect || stmt.answer === false)) {
          feedbackEl.innerHTML = `<span class="feedback-icon">💡</span> ${stmt.explanation}`
          feedbackEl.classList.remove('hidden')
        }
      })

      if (allCorrect) {
        playSound('correct')
        score++
      } else {
        playSound('wrong')
      }

      // Save answer
      userAnswers.push({
        q: q.prompt,
        options: ['Câu hỏi Đúng/Sai'],
        ans: 'Tất cả các ý',
        selected: allCorrect ? 'Đã chọn chính xác' : 'Có ý chọn sai',
        isCorrect: allCorrect,
      })

      // Show a button to continue instead of auto timeout, since they need time to read feedback
      const continueBtn = document.createElement('button')
      continueBtn.className = 'tf-submit-btn'
      continueBtn.innerText = 'Tiếp tục'
      continueBtn.style.marginTop = '15px'
      continueBtn.style.background = '#10b981'
      continueBtn.addEventListener('click', () => {
        currentQuizIndex++
        showQuizQuestion()
      })
      document.querySelector('.tf-container').appendChild(continueBtn)
    })
  }

  function renderSentenceBuilderQuestion(q) {
    const distractorsCount = q.distractors ? q.distractors.length : 0
    const piecesCount = q.correctOrder ? q.correctOrder.length : 0

    quizOptions.innerHTML = `
      <div class="sb-hint" style="margin-bottom: 15px; color: #0284c7; background: #e0f2fe; padding: 12px; border-radius: 8px; font-size: 0.95rem; border-left: 4px solid #0284c7; line-height: 1.5;">
        💡 <strong>Gợi ý:</strong> Câu hoàn chỉnh được ghép từ <strong>${piecesCount}</strong> cụm từ. 
        <br><span style="font-size: 0.85rem; color: #64748b;">(Lưu ý: Có <strong>${distractorsCount}</strong> phương án gây nhiễu dư thừa)</span>
      </div>
      <div class="sentence-build-area" id="sb-area"></div>
      <div class="word-bank" id="sb-bank"></div>
      <button class="sb-submit-btn" id="sb-submit">Xác nhận câu</button>
    `

    const sbArea = document.getElementById('sb-area')
    const sbBank = document.getElementById('sb-bank')
    const sbSubmit = document.getElementById('sb-submit')

    // Combine correct order and distractors, then shuffle
    const words = [...q.correctOrder, ...(q.distractors || [])].sort(
      () => Math.random() - 0.5,
    )

    words.forEach((word, index) => {
      const btn = document.createElement('button')
      btn.className = 'word-btn'
      btn.innerText = word
      btn.dataset.word = word

      btn.addEventListener('click', () => {
        if (btn.parentElement === sbBank) {
          // Move to area as a chip
          const chip = document.createElement('div')
          chip.className = 'sentence-chip'
          chip.innerText = word
          chip.dataset.word = word
          chip.addEventListener('click', () => {
            sbArea.removeChild(chip)
            btn.style.display = 'inline-block'
          })
          sbArea.appendChild(chip)
          btn.style.display = 'none'
        }
      })
      sbBank.appendChild(btn)
    })

    sbSubmit.addEventListener('click', () => {
      const chips = Array.from(sbArea.children)
      const userSen = chips.map((c) => c.dataset.word)

      // Validation
      const isCorrect =
        JSON.stringify(userSen) === JSON.stringify(q.correctOrder)

      if (isCorrect) score++

      userAnswers.push({
        q: q.prompt,
        options: `[${userSen.join(' ')}]`,
        ans: q.correctOrder.join(' '),
        sel: isCorrect ? q.correctOrder.join(' ') : userSen.join(' '),
        isCorrect: isCorrect,
      })

      // Delay to allow review
      if (isCorrect) {
        playSound('correct')
        sbArea.style.borderColor = '#10b981' // green border
        sbArea.style.backgroundColor = '#d1fae5'
      } else {
        playSound('wrong')
        sbArea.style.borderColor = '#ef4444' // red border
        sbArea.style.backgroundColor = '#fee2e2'
        sbArea.classList.add('shake')
      }

      setTimeout(() => {
        currentQuizIndex++
        showQuizQuestion()
      }, 1000)
    })
  }

  function renderFillBlankQuestion(q) {
    const parts = q.prompt.split('[___]')
    if (parts.length === 1) parts.push('')

    quizQuestionText.innerHTML = `
      <div class="fill-blank-text">
        ${parts[0]}<span id="blank-spot" class="blank-spot">   </span>${parts[1]}
      </div>
      <div class="word-bank" id="word-bank"></div>
    `

    const wordBank = document.getElementById('word-bank')
    const options = [...q.options].sort(() => Math.random() - 0.5)

    options.forEach((opt) => {
      const btn = document.createElement('button')
      btn.className = 'word-btn'
      btn.innerText = opt
      btn.addEventListener('click', () =>
        handleFillBlankSelect(btn, opt, q.answer, q),
      )
      wordBank.appendChild(btn)
    })
  }

  function handleFillBlankSelect(btnElement, selectedOpt, correctOpt, q) {
    const blankSpot = document.getElementById('blank-spot')
    if (!blankSpot) return

    const allBtns = document.querySelectorAll('.word-btn')
    allBtns.forEach((b) => (b.style.pointerEvents = 'none'))

    btnElement.classList.add('used')
    blankSpot.innerText = selectedOpt
    blankSpot.classList.add('filled')

    userAnswers.push({
      q: q.prompt,
      options: q.options,
      ans: correctOpt,
      sel: selectedOpt,
    })

    if (selectedOpt === correctOpt) {
      playSound('correct')
      blankSpot.classList.add('correct-fill')
      score++
    } else {
      playSound('wrong')
      blankSpot.classList.add('wrong-fill')
      blankSpot.classList.add('shake')
      blankSpot.innerHTML += ` <span style="font-size: 0.8em; color: var(--color-success); font-weight: bold;">(${correctOpt})</span>`
    }

    setTimeout(() => {
      currentQuizIndex++
      showQuizQuestion()
    }, 1800)
  }

  function endQuiz(timesUp = false) {
    stopTimer()
    switchView('view-result')
    const total = quizQuestions.length
    const percentage = Math.round((score / total) * 100)

    document.getElementById('score-text').innerText = `${percentage}%`
    document.getElementById('correct-count').innerText = score
    document.getElementById('wrong-count').innerText = total - score

    // Bắn pháo giấy và phát âm thanh hoàn thành nếu làm tốt
    playSound('complete')

    // Hệ thống danh hiệu / Lời khen
    const rewardBadge = document.getElementById('reward-badge')
    const rewardMessage = document.getElementById('reward-message')

    // Reset Trạng thái
    rewardBadge.style.display = 'inline-block'
    rewardBadge.style.animation = 'none'
    rewardBadge.offsetHeight /* trigger reflow */
    rewardBadge.style.animation = null

    if (percentage === 100) {
      rewardBadge.innerText = '🏆'
      rewardMessage.innerText = 'Xuất sắc tuyệt đối! Bạn là quán quân KHTN 7!'
      rewardMessage.style.color = '#ef4444' // Đỏ nổi bật
      if (window.confetti) {
        window.confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } })
      }
    } else if (percentage >= 80) {
      rewardBadge.innerText = '🥇'
      rewardMessage.innerText = 'Tuyệt vời! Kiến thức của bạn rất vững!'
      rewardMessage.style.color = 'var(--color-primary)'
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      }
    } else if (percentage >= 60) {
      rewardBadge.innerText = '🥈'
      rewardMessage.innerText =
        'Khá lắm! Cố gắng thêm chút nữa để đạt điểm tối đa nha.'
      rewardMessage.style.color = 'var(--color-secondary)'
    } else if (percentage >= 40) {
      rewardBadge.innerText = '🥉'
      rewardMessage.innerText =
        'Bạn đạt mức trung bình. Hãy xem lại các câu sai nhé.'
      rewardMessage.style.color = '#f59e0b' // Vàng cam
    } else {
      rewardBadge.innerText = '📚'
      rewardMessage.innerText =
        'Đừng nản lòng! Ôn lại Thẻ Học và thử lại lần nữa nào!'
      rewardMessage.style.color = '#64748b' // Xám
    }

    const reviewList = document.getElementById('review-list')
    if (reviewList) {
      reviewList.innerHTML = ''
      userAnswers.forEach((ans, i) => {
        const isCorrect = ans.sel === ans.ans
        const color = isCorrect ? '#007bff' : 'var(--color-error)'
        const correctMarkup = !isCorrect
          ? `<br><span style="color:#007bff">Đáp án đúng: ${ans.ans}</span>`
          : ''

        reviewList.innerHTML += `
          <div style="padding: 1rem 0; border-bottom: 1px solid #ddd;">
            <p style="font-weight: 600; margin-bottom: 0.25rem;">Câu ${i + 1}: ${ans.q}</p>
            <span style="color: ${color}; font-weight: 500;">Bạn chọn: ${ans.sel}</span>
            ${correctMarkup}
          </div>
        `
      })
    }

    if (timesUp) {
      alert('Hết giờ làm bài!')
    }
  }

  document.getElementById('btn-review').addEventListener('click', () => {
    const rc = document.getElementById('review-container')
    if (rc.style.display === 'none') {
      rc.style.display = 'block'
      document.getElementById('btn-review').innerText = 'Ẩn đáp án'
    } else {
      rc.style.display = 'none'
      document.getElementById('btn-review').innerText = 'Xem lại câu hỏi'
    }
  })

  document.getElementById('btn-retry').addEventListener('click', () => {
    switchView('view-quiz-setup')
  })

  document.getElementById('btn-home').addEventListener('click', () => {
    navItems.forEach((n) => n.classList.remove('active'))
    document
      .querySelector('.nav-item[data-target="view-home"]')
      .classList.add('active')
    switchView('view-home')
  })
  function renderEquationFillQuestion(q) {
    const container = document.getElementById('quiz-options')
    container.innerHTML = ''

    if (!userAnswers[currentQuizIndex]) {
      userAnswers[currentQuizIndex] = {
        slot1: null,
        slot2: null,
      }
    }

    const eqContainer = document.createElement('div')
    eqContainer.className = 'equation-container'

    const reactantsDiv = document.createElement('div')
    reactantsDiv.className = 'eq-side eq-reactants'

    q.equation.reactants.forEach((item) => {
      if (item.type === 'text') {
        const span = document.createElement('span')
        span.textContent = item.value
        reactantsDiv.appendChild(span)
      } else if (item.type === 'operator') {
        const span = document.createElement('span')
        span.className = 'eq-operator'
        span.textContent = item.value
        reactantsDiv.appendChild(span)
      } else if (item.type === 'slot') {
        const slot = document.createElement('div')
        slot.className = 'eq-slot'
        slot.dataset.slotId = item.id

        const val = userAnswers[currentQuizIndex][item.id]
        if (val) {
          slot.textContent = val
          slot.classList.add('filled')
        } else {
          slot.textContent = '?'
        }

        slot.addEventListener('click', () => {
          if (slot.classList.contains('filled')) {
            userAnswers[currentQuizIndex][item.id] = null
            renderEquationFillQuestion(q)
          }
        })
        reactantsDiv.appendChild(slot)
      }
    })

    const arrowDiv = document.createElement('div')
    arrowDiv.className = 'eq-arrow-container'
    const arrowTop = document.createElement('div')
    arrowTop.className = 'eq-arrow-label'
    arrowTop.textContent = q.equation.arrows.top
    const arrowGraphic = document.createElement('div')
    arrowGraphic.className = 'eq-arrow-line'
    arrowGraphic.innerHTML = '&#10230;'
    const arrowBottom = document.createElement('div')
    arrowBottom.className = 'eq-arrow-label'
    arrowBottom.textContent = q.equation.arrows.bottom
    arrowDiv.appendChild(arrowTop)
    arrowDiv.appendChild(arrowGraphic)
    arrowDiv.appendChild(arrowBottom)

    const productsDiv = document.createElement('div')
    productsDiv.className = 'eq-side eq-products'

    q.equation.products.forEach((item) => {
      if (item.type === 'text') {
        const span = document.createElement('span')
        span.textContent = item.value
        productsDiv.appendChild(span)
      } else if (item.type === 'operator') {
        const span = document.createElement('span')
        span.className = 'eq-operator'
        span.textContent = item.value
        productsDiv.appendChild(span)
      } else if (item.type === 'slot') {
        const slot = document.createElement('div')
        slot.className = 'eq-slot'
        slot.dataset.slotId = item.id

        const val = userAnswers[currentQuizIndex][item.id]
        if (val) {
          slot.textContent = val
          slot.classList.add('filled')
        } else {
          slot.textContent = '?'
        }

        slot.addEventListener('click', () => {
          if (slot.classList.contains('filled')) {
            userAnswers[currentQuizIndex][item.id] = null
            renderEquationFillQuestion(q)
          }
        })
        productsDiv.appendChild(slot)
      }
    })

    eqContainer.appendChild(reactantsDiv)
    eqContainer.appendChild(arrowDiv)
    eqContainer.appendChild(productsDiv)

    container.appendChild(eqContainer)

    const hint = document.createElement('div')
    hint.className = 'sc-hint'
    hint.innerText =
      'Chạm vào từ bên dưới để điền vào ô trống. Chạm vào ô đã điền để chọn lại.'
    container.appendChild(hint)

    const wordBankDiv = document.createElement('div')
    wordBankDiv.className = 'eq-wordbank'

    q.wordBank.forEach((word) => {
      const isUsed = Object.values(userAnswers[currentQuizIndex]).includes(word)

      const chip = document.createElement('button')
      chip.className = 'eq-chip'
      chip.textContent = word
      if (isUsed) {
        chip.disabled = true
        chip.classList.add('used')
      }

      chip.addEventListener('click', () => {
        const ansObj = userAnswers[currentQuizIndex]
        let firstEmpty = null
        if (!ansObj.slot1) firstEmpty = 'slot1'
        else if (!ansObj.slot2) firstEmpty = 'slot2'

        if (firstEmpty) {
          ansObj[firstEmpty] = word
          renderEquationFillQuestion(q)
        }
      })

      wordBankDiv.appendChild(chip)
    })

    container.appendChild(wordBankDiv)

    const submitBtn = document.createElement('button')
    submitBtn.className = 'btn fill'
    submitBtn.textContent = 'Kiểm tra'
    submitBtn.style.marginTop = '20px'
    submitBtn.disabled = !(
      userAnswers[currentQuizIndex].slot1 && userAnswers[currentQuizIndex].slot2
    )
    submitBtn.addEventListener('click', () => checkEquationFillAnswer(q))
    container.appendChild(submitBtn)
  }

  function checkEquationFillAnswer(q) {
    const ansObj = userAnswers[currentQuizIndex]
    const isCorrect =
      ansObj.slot1 === q.correctSlots.slot1 &&
      ansObj.slot2 === q.correctSlots.slot2

    const slots = document.querySelectorAll('.eq-slot')
    slots.forEach((slot) => {
      const sId = slot.dataset.slotId
      if (ansObj[sId] === q.correctSlots[sId]) {
        slot.classList.add('correct')
      } else {
        slot.classList.add('incorrect')
      }
      slot.style.pointerEvents = 'none'
    })

    const wordBank = document.querySelector('.eq-wordbank')
    if (wordBank) wordBank.style.display = 'none'

    const container = document.getElementById('quiz-options')

    const feedbackEl = document.createElement('div')
    feedbackEl.style.padding = '15px'
    feedbackEl.style.marginTop = '20px'
    feedbackEl.style.borderRadius = '8px'
    feedbackEl.style.backgroundColor = isCorrect ? '#dcfce7' : '#fee2e2'
    feedbackEl.style.color = isCorrect ? '#166534' : '#991b1b'
    feedbackEl.innerHTML =
      '<strong>' +
      (isCorrect ? 'Tuyệt vời! ' : 'Chưa chính xác. ') +
      '</strong>' +
      (q.explanation || '')

    if (!isCorrect) {
      feedbackEl.classList.add('shake')
    }

    container.appendChild(feedbackEl)

    if (isCorrect) {
      playSound('correct')
      score++
    } else {
      playSound('wrong')
    }

    userAnswers[currentQuizIndex] = {
      q: 'Phản ứng quang hợp',
      options: ['Điền phương trình'],
      ans: 'Đúng',
      sel: isCorrect ? 'Đúng' : 'Sai',
    }

    const oldBtns = container.querySelectorAll('.btn.fill')
    oldBtns.forEach((b) => (b.style.display = 'none'))

    const continueBtn = document.createElement('button')
    continueBtn.className = 'btn fill'
    continueBtn.innerText = 'Tiếp tục'
    continueBtn.style.marginTop = '15px'
    continueBtn.style.background = '#10b981'
    continueBtn.addEventListener('click', () => {
      currentQuizIndex++
      showQuizQuestion()
    })
    container.appendChild(continueBtn)
  }
})
