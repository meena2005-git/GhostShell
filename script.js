
let score = 0;
let completedMissions = [];
let answeredCorrectly = false;

const missions = {
  1: {
    title: "THE PHANTOM LOGIN",
    question: "What suspicious activity happened?",
    logs: [
      "Login successful: user01",
      "Failed login: unknown_user",
      "Failed login: unknown_user",
      "Failed login: unknown_user"
    ],
    clue: "Anomaly detected: repeated failed logins.",
    options: [
      ["A. A normal system update", "wrong"],
      ["B. Repeated failed login attempts", "correct"],
      ["C. A successful file backup", "wrong"]
    ],
    explanation:
      "Repeated failed logins may indicate a login attack."
  },

  2: {
    title: "THE HIDDEN PROCESS",
    question: "Which process should be investigated?",
    logs: [
      "Process started: text_editor",
      "Process started: system_backup",
      "Process started: unknown_task",
      "Process completed: text_editor"
    ],
    clue: "One process has an unfamiliar name.",
    options: [
      ["A. text_editor", "wrong"],
      ["B. unknown_task", "correct"],
      ["C. system_backup", "wrong"]
    ],
    explanation:
      "An unfamiliar process deserves investigation, but its name alone does not prove malware."
  }
};

// Optional sound effects
function playSound(type) {
  try {
    const AudioClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return;

    const audio = new AudioClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.type = "sine";
    oscillator.frequency.value =
      type === "success" ? 660 : 220;

    gain.gain.setValueAtTime(0.06, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + 0.2
    );

    oscillator.onended = () => audio.close();

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.2);
  } catch (error) {
    console.log("Sound unavailable:", error);
  }
}

function updateHomeProgress() {
  const scoreDisplay = document.querySelector("#scoreDisplay");
  const progressFill = document.querySelector(".progress-fill");
  const progressText = document.querySelector("#progressText");

  if (scoreDisplay) {
    scoreDisplay.textContent = `🏆 Score: ${score}`;
  }

  if (progressFill) {
    progressFill.style.width =
      `${(completedMissions.length / 2) * 100}%`;
  }

  if (progressText) {
    progressText.textContent =
      `${completedMissions.length} / 2 missions completed`;
  }
}

function startMission(missionNumber = 1) {
  const mission = missions[missionNumber];

  if (!mission) return;

  answeredCorrectly = completedMissions.includes(missionNumber);

  document.body.innerHTML = `
    <main class="mission">
      <h1>👻 GhostShell</h1>

      <p class="status">
        MISSION 0${missionNumber} — ${mission.title}
      </p>

      <p id="scoreDisplay">🏆 Score: ${score}</p>

      <section class="terminal">
        <p class="green">ghost@ghostshell:~$ scan</p>

        ${mission.logs.map(log => `
          <p class="${
            log.includes("Failed") || log.includes("unknown")
              ? "red"
              : ""
          }">${log}</p>
        `).join("")}

        <p class="green">${mission.clue}</p>
      </section>

      <section class="question">
        <h2>🔎 Solve the Mystery</h2>
        <p>${mission.question}</p>

        ${mission.options.map(([label, answer]) => `
          <button class="answer" data-answer="${answer}"
            ${answeredCorrectly ? "disabled" : ""}>
            ${label}
          </button>
        `).join("")}

        <p id="feedback" aria-live="polite">${
          answeredCorrectly ? "✅ Mission already completed!" : ""
        }</p>

        <button id="nextMission" ${answeredCorrectly ? "" : "disabled"}>
          ${missionNumber === 1 ? "Next Mission →" : "Finish Game 🎉"}
        </button>

        <button id="backButton">Back to Home</button>
      </section>
    </main>
  `;

  const nextButton = document.querySelector("#nextMission");

  document.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => {
      const feedback = document.querySelector("#feedback");
      const scoreDisplay = document.querySelector("#scoreDisplay");

      if (answeredCorrectly) return;

      if (button.dataset.answer === "correct") {
        playSound("success");
        answeredCorrectly = true;
        score += 100;

        completedMissions.push(missionNumber);

        feedback.textContent = `✅ Correct! ${mission.explanation}`;
        feedback.style.color = "#4ade80";
        scoreDisplay.textContent = `🏆 Score: ${score}`;

        // Prevent earning points repeatedly
        document.querySelectorAll(".answer").forEach(answerButton => {
          answerButton.disabled = true;
        });

        nextButton.disabled = false;
      } else {
        playSound("error");
        feedback.textContent =
          "❌ Not quite! Check the logs and try again.";
        feedback.style.color = "#f87171";
      }
    });
  });

  nextButton.addEventListener("click", () => {
    if (!answeredCorrectly) return;

    if (missionNumber === 1) {
      startMission(2);
    } else {
      showFinalScreen();
    }
  });

  document.querySelector("#backButton").addEventListener("click", showHome);
}

function showFinalScreen() {
  document.body.innerHTML = `
    <main class="mission">
      <h1>👻 GhostShell</h1>

      <section class="question">
        <h2>🎉 All Missions Complete!</h2>
        <p>You solved both cybersecurity mysteries.</p>
        <p>🏆 Final Score: ${score} / 200</p>
        <p>📊 Missions completed: ${completedMissions.length} / 2</p>

        <button id="backButton">Back to Home</button>
      </section>
    </main>
  `;

  document.querySelector("#backButton").addEventListener("click", showHome);
}

function showHome() {
  document.body.innerHTML = `
    <main class="home">
      <p class="status">● SYSTEM ONLINE</p>
      <h1>👻 GhostShell</h1>
      <p class="subtitle">A Friendly Cybersecurity Simulator</p>
      <p>Enter the machine. Find the ghost. Solve the mystery.</p>

      <p id="scoreDisplay">🏆 Score: ${score}</p>

      <section class="mission-cards">
        <article class="mission-card">
          <h2>🔐 Mission 01</h2>
          <h3>The Phantom Login</h3>
          <p>Investigate suspicious login attempts in simulated logs.</p>
          <span>Difficulty: Beginner</span>
        </article>

        <article class="mission-card">
          <h2>👁️ Mission 02</h2>
          <h3>The Hidden Process</h3>
          <p>Investigate an unfamiliar simulated process.</p>
          <span>Difficulty: Beginner</span>
        </article>
      </section>

      <section class="progress-area">
        <p>Mission Progress</p>
        <div class="progress-track">
          <div class="progress-fill"></div>
        </div>
        <p id="progressText"></p>
      </section>

      <button id="startButton">🚀 Start Mission</button>
      <p class="footer-text">TRAIN • INVESTIGATE • LEARN</p>
    </main>
  `;

  updateHomeProgress();

  document.querySelector("#startButton").addEventListener("click", () => {
    startMission(completedMissions.includes(1) ? 2 : 1);
  });
}

// Initial home screen button
const startButton = document.querySelector("#startButton");

if (startButton) {
  startButton.addEventListener("click", () => startMission(1));
}

updateHomeProgress();
