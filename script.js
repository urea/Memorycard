const cardsData = [1, 1, 2, 2, 3, 3, 4, 4];
const gameBoard = document.getElementById('game-board');
const messageArea = document.getElementById('message-area'); // メッセージエリアを取得
const restartButton = document.getElementById('restart-button'); // 「もう一回」ボタンを取得
let flippedCards = [];
let matchedCards = [];
let isProcessing = false; // 処理中かどうかを管理するフラグ
let startTime = null; // 計測開始時刻を保持する変数
let endTime = null; //計測終了時刻を保持する変数
let isGameStarted = false; // ゲームが開始されたかどうかを管理するフラグ

function shuffle(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCards() {
  shuffle(cardsData);
  for (let i = 0; i < cardsData.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = cardsData[i];
    card.addEventListener('click', handleCardClick);
    card.style.backgroundImage = "url(images/card_back.png)";
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    gameBoard.appendChild(card);
  }
}

function handleCardClick(event) {
  if (isProcessing) {
    return; // 処理中はクリックを無視
  }
  // ゲーム開始時にタイムを計測
  if (!isGameStarted) {
    startTimer();
    isGameStarted = true;
  }
  const clickedCard = event.currentTarget;
  if (clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) {
    return;
  }
  flipCard(clickedCard);
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    isProcessing = true; // 処理中フラグを立てる
    setTimeout(checkMatch, 500);
  }
}

function flipCard(card) {
  if (card.classList.contains('flipped')) {
    return;
  }
  card.classList.add('flipped');
  const cardValue = card.dataset.value;
  card.style.backgroundImage = `url(images/card${cardValue}.png)`;
}

async function checkMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];

  if (card1.dataset.value === card2.dataset.value) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(card1, card2);
    if (matchedCards.length === cardsData.length) {
      endTimer();
      const elapsedTime = calculateElapsedTime();
      displayMessage(`ゲームクリア！ 経過時間: ${elapsedTime}秒`); // クリアメッセージを表示
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 裏返す時間待つ。
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    // 画像を裏に戻す処理
    card1.style.backgroundImage = "url(images/card_back.png)";
    card2.style.backgroundImage = "url(images/card_back.png)";
  }
  flippedCards = [];
  isProcessing = false; // 処理終了フラグを下ろす
}

function initializeGame() {
  gameBoard.innerHTML = "";
  matchedCards = [];
  flippedCards = [];
  isProcessing = false; // 初期化時もフラグを下ろす
  isGameStarted = false;// ゲームスタートフラグを初期化
  messageArea.textContent = ""; // メッセージエリアを初期化
  //restartButton.style.display = 'none'; // ボタンを非表示にする ← この行を削除
  createCards();
}

function startTimer() {
  startTime = new Date(); // 現在時刻を取得
}

function endTimer() {
  endTime = new Date();
}

function calculateElapsedTime() {
  const diff = endTime.getTime() - startTime.getTime(); // 経過時間をミリ秒で取得
  const seconds = diff / 1000; // 秒に変換
  return seconds.toFixed(3); // 小数点以下3桁で表示
}

function displayMessage(message) {
    messageArea.textContent = message; // メッセージエリアにテキストを設定
}

// 「もう一回」ボタンのクリックイベント
restartButton.addEventListener('click', () => {
    initializeGame();
});

initializeGame();
