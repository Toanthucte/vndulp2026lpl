const fs = require('fs');

const jsPath = 'js/app.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. We need to add logic for btn-fc-easy and btn-fc-hard and fc-assessment-controls.
// Under: const fcProgress = document.getElementById('fc-progress')
const assessmentDecl = 
    const fcAssessmentControls = document.getElementById('fc-assessment-controls')
    const btnFcEasy = document.getElementById('btn-fc-easy')
    const btnFcHard = document.getElementById('btn-fc-hard')
;
content = content.replace("const fcProgress = document.getElementById('fc-progress')", "const fcProgress = document.getElementById('fc-progress')\n" + assessmentDecl);

// 2. Modify showFlashcard() function to hide controls
//    flashcardInner.classList.remove('is-flipped')
//    fcAssessmentControls.classList.remove('visible')
content = content.replace("flashcardInner.classList.remove('is-flipped')", "flashcardInner.classList.remove('is-flipped')\n      fcAssessmentControls.classList.remove('visible')");

// 3. Modify click on flashcardInner to toggle controls
const toggleReplace = lashcardInner.addEventListener('click', () => {
      const isCurrentlyFlipped = flashcardInner.classList.contains('is-flipped')
      if (isCurrentlyFlipped) {
        flashcardInner.classList.remove('is-flipped')
        fcAssessmentControls.classList.remove('visible')
      } else {
        flashcardInner.classList.add('is-flipped')
        fcAssessmentControls.classList.add('visible')
      }
    });
content = content.replace("flashcardInner.addEventListener('click', () => {\n      flashcardInner.classList.toggle('is-flipped')\n    })", toggleReplace);

// 4. Add Assessment Logic
const assessmentLogic = 
    function processAssessment(type) {
      // Logic from assessment. e.g. record score for memory
      if (currentCardIndex < currentCards.length - 1) {
        currentCardIndex++
        showFlashcard()
      } else {
        alert('Đã hoàn thành vòng thẻ học!')
      }
    }

    btnFcEasy.addEventListener('click', () => processAssessment('easy'))
    btnFcHard.addEventListener('click', () => processAssessment('hard'))
;
content = content.replace("document.getElementById('btn-next-card').addEventListener(", assessmentLogic + "\n    document.getElementById('btn-next-card').addEventListener(");

fs.writeFileSync(jsPath, content, 'utf8');
console.log("Updated app.js");
