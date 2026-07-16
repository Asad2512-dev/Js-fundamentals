(function initQuizApp() {
  const quizElements = {
    status: document.querySelector("#quizStatus"),
    mount: document.querySelector("#quizMount"),
    simulateErrorButton: document.querySelector("#simulateErrorButton")
  };

  const questionBank = [
    {
      question: "Which keyword should be used by default when a variable will not be reassigned?",
      answers: ["let", "const", "var", "new"],
      correctIndex: 1
    },
    {
      question: "What does document.querySelector return?",
      answers: ["Every matching element", "The first matching element", "Only text nodes", "A CSS file"],
      correctIndex: 1
    },
    {
      question: "Which array method creates a new array by transforming every item?",
      answers: ["map", "reduce", "find", "push"],
      correctIndex: 0
    },
    {
      question: "What is a Promise used to represent?",
      answers: ["A future async result", "A CSS transition", "A blocked loop", "A browser tab"],
      correctIndex: 0
    }
  ];

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnsweredCurrentQuestion = false;
  let shouldFailNextLoad = false;
  let latestRequestId = 0;

  function simulateQuestionRequest() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFailNextLoad) {
          shouldFailNextLoad = false;
          reject(new Error("The simulated API request failed. Retry to load the quiz."));
          return;
        }

        resolve(questionBank.map((question) => ({ ...question, answers: [...question.answers] })));
      }, 700);
    });
  }

  async function loadQuestions() {
    const requestId = latestRequestId + 1;
    latestRequestId = requestId;
    showLoadingState();

    try {
      const loadedQuestions = await simulateQuestionRequest();
      if (requestId !== latestRequestId) {
        return;
      }

      questions = loadedQuestions;
      currentQuestionIndex = 0;
      score = 0;
      hasAnsweredCurrentQuestion = false;
      showSuccessState();
      renderQuestion();
    } catch (error) {
      if (requestId === latestRequestId) {
        showErrorState(error.message);
      }
    } finally {
      if (requestId === latestRequestId) {
        quizElements.simulateErrorButton.disabled = false;
      }
    }
  }

  function showLoadingState() {
    quizElements.status.textContent = "Loading questions...";
    quizElements.mount.replaceChildren();
    quizElements.simulateErrorButton.disabled = true;
  }

  function showSuccessState() {
    quizElements.status.textContent = "Questions loaded successfully. Choose the best answer.";
  }

  function showErrorState(message) {
    quizElements.status.textContent = message;
    quizElements.mount.replaceChildren();

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Retry loading quiz";
    retryButton.addEventListener("click", loadQuestions);
    quizElements.mount.append(retryButton);
    retryButton.focus();
  }

  function simulateApiErrorForAssessment() {
    shouldFailNextLoad = true;
    loadQuestions();
  }

  function renderQuestion() {
    const question = questions[currentQuestionIndex];
    quizElements.mount.replaceChildren();

    const questionWrapper = document.createElement("article");
    questionWrapper.className = "question-card";

    const progressText = document.createElement("p");
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length} · Score: ${score}`;

    const progressBar = document.createElement("progress");
    progressBar.className = "progress";
    progressBar.max = questions.length;
    progressBar.value = currentQuestionIndex + 1;
    progressBar.setAttribute("aria-label", `Quiz progress: question ${currentQuestionIndex + 1} of ${questions.length}`);

    const heading = document.createElement("h2");
    heading.id = "currentQuestion";
    heading.tabIndex = -1;
    heading.textContent = question.question;

    const answerList = document.createElement("div");
    answerList.className = "answers";
    answerList.setAttribute("role", "group");
    answerList.setAttribute("aria-labelledby", heading.id);

    question.answers.forEach((answer, answerIndex) => {
      const answerButton = document.createElement("button");
      answerButton.type = "button";
      answerButton.className = "answer-button";
      answerButton.textContent = answer;
      answerButton.addEventListener("click", () => handleAnswer(answerIndex));
      answerList.append(answerButton);
    });

    questionWrapper.append(progressText, progressBar, heading, answerList);
    quizElements.mount.append(questionWrapper);
    heading.focus();
  }

  function handleAnswer(selectedIndex) {
    if (hasAnsweredCurrentQuestion) {
      return;
    }

    hasAnsweredCurrentQuestion = true;
    const question = questions[currentQuestionIndex];
    const answerButtons = quizElements.mount.querySelectorAll(".answer-button");
    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) {
      score += 1;
    }

    answerButtons.forEach((button, index) => {
      button.disabled = true;
      if (index === question.correctIndex) {
        button.classList.add("is-correct");
      } else if (index === selectedIndex) {
        button.classList.add("is-wrong");
      }
    });

    quizElements.status.textContent = isCorrect ? "Correct answer." : "Not quite. The correct answer is highlighted.";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "next-button";
    nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Show results" : "Next question";
    nextButton.addEventListener("click", goToNextStep);
    quizElements.mount.querySelector(".question-card").append(nextButton);
    nextButton.focus();
  }

  function goToNextStep() {
    if (currentQuestionIndex === questions.length - 1) {
      renderResults();
      return;
    }

    currentQuestionIndex += 1;
    hasAnsweredCurrentQuestion = false;
    quizElements.status.textContent = "Choose the best answer.";
    renderQuestion();
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    hasAnsweredCurrentQuestion = false;
    quizElements.status.textContent = "Quiz restarted. Choose the best answer.";
    renderQuestion();
  }

  function renderResults() {
    quizElements.status.textContent = "Quiz complete.";
    quizElements.mount.replaceChildren();

    const resultCard = document.createElement("article");
    resultCard.className = "result-card";

    const heading = document.createElement("h2");
    heading.tabIndex = -1;
    heading.textContent = "Final results";

    const resultText = document.createElement("p");
    resultText.textContent = `You scored ${score} out of ${questions.length}.`;

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.textContent = "Restart quiz";
    restartButton.addEventListener("click", restartQuiz);

    resultCard.append(heading, resultText, restartButton);
    quizElements.mount.append(resultCard);
    heading.focus();
  }

  quizElements.simulateErrorButton.addEventListener("click", simulateApiErrorForAssessment);
  loadQuestions();
}());
