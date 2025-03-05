let players = [];
let playerNames = [];

function showAlert(message) {
  const alertContainer = document.getElementById('custom-alert');
  const overlay = document.getElementById('overlay');
  const alertMessage = document.getElementById('alert-message');
  alertMessage.innerText = message;
  
  overlay.style.display = 'flex'; // Show the overlay
  alertContainer.classList.add('show');
  
  // Hide the alert and overlay after 3 seconds
  setTimeout(() => {
    closeAlert();
  }, 4000); // Alert visible for 3 seconds
}

function closeAlert() {
  const alertContainer = document.getElementById('custom-alert');
  const overlay = document.getElementById('overlay');
  alertContainer.classList.remove('show');
  overlay.style.display = 'none'; // Hide the overlay
}

function proceedToNames() {
  const numPlayers = document.getElementById("num-players").value;
  if (numPlayers < 2 || numPlayers > 10) {
    showAlert("Iltimos, 2 dan 10 gacha bo'lgan o'yinchilar sonini kiriting.");
    return;
  }

  const nameInputsDiv = document.getElementById("name-inputs");
  nameInputsDiv.innerHTML = "";
  for (let i = 0; i < numPlayers; i++) {
    nameInputsDiv.innerHTML += `
      <div>
        <label>${i + 1} O'yinchining ismini kiriting: </label>
        <input type="text" id="player-${i}-name" value="" placeholder="Ismingizni kiriting">
      </div>
    `;
  }

  document.getElementById("start-menu").style.display = "none";
  document.getElementById("name-menu").style.display = "block";
}

function startGame() {
  const numPlayers = document.getElementById("num-players").value;
  players = Array(parseInt(numPlayers)).fill(0);
  playerNames = [];

  for (let i = 0; i < numPlayers; i++) {
    const nameInput = document.getElementById(`player-${i}-name`);
    playerNames.push(nameInput.value || `${i + 1} o'yinchi `);
  }

  displayGameMenu();
}

function displayGameMenu() {
  const playerInputsDiv = document.getElementById("player-inputs");
  playerInputsDiv.innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    playerInputsDiv.innerHTML += `
      <div>
        <label>${playerNames[i]}ning Ballari: </label>
        <input type="number" id="player-${i}-points" value="" min="">
      </div>
    `;
  }

  document.getElementById("start-menu").style.display = "none";
  document.getElementById("name-menu").style.display = "none";
  document.getElementById("game-menu").style.display = "block";

  updateScores();
}

function calculatePoints() {
  for (let i = 0; i < players.length; i++) {
    const pointsInput = document.getElementById(`player-${i}-points`);
    const points = parseInt(pointsInput.value);
    players[i] += points;
    pointsInput.value = "";

    if (players[i] >= 500) {
      celebrate(i);
    }
  }

  updateScores();
}

function updateScores() {
  const playerScoresDiv = document.getElementById("player-scores");
  playerScoresDiv.innerHTML = "";
  players.forEach((score, index) => {
    playerScoresDiv.innerHTML += `<div class="player-score">${playerNames[index]}: ${score} ballari </div>`;
  });
}

function saveGame() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  // Using template literals:
  const defaultName = `${year} yil, ${month} oy, :${day} kungi uno oyin`;
  const fileName = prompt("JSON fayl nomini kiriting:", defaultName);

  if (!fileName) return;

  const gameData = {
    players: players,
    playerNames: playerNames,
  };

  const json = JSON.stringify(gameData);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function loadGame(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const gameData = JSON.parse(e.target.result);
    players = gameData.players;
    playerNames = gameData.playerNames;

    document.getElementById("num-players").value = players.length;
    displayGameMenu(); // Directly start the game after loading data
  };

  reader.readAsText(file);
}

function celebrate(playerIndex) {
  document.getElementById("celebration").style.display = "flex";
  document.getElementById(
    "winner"
  ).innerText = `${playerNames[playerIndex]} 500 balga yetdilar!`;

  const celebrationSound = document.getElementById("celebration-sound");
  celebrationSound.play();

  setTimeout(() => {
    document.getElementById("celebration").style.display = "none";
  }, 5000);
}

// Prevent accidental page reload
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});
