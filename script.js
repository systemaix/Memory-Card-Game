const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const overlay = document.getElementById('win-overlay');

const EMOJIS = ['🍕', '🚀', '🐱', '🌵', '🎸', '🍦', '🎈', '💎'];
let cards = [...EMOJIS, ...EMOJIS];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let isLocked = false; 

// 1. Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 2. Init Game
function initGame() {
    grid.innerHTML = '';
    cards = shuffle(cards);
    
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const front = document.createElement('div');
        front.classList.add('face', 'front');
        front.innerText = emoji;

        const back = document.createElement('div');
        back.classList.add('face', 'back');

        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

// 3. Flip Logic
function flipCard() {
    if (isLocked) return;
    if (this === flippedCards[0]) return;
    // Fix: Don't allow clicking matched cards
    if (this.classList.contains('matched')) return; 

    this.classList.add('flip');

    if (!timer) startTimer();

    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// 4. Check Match
function checkMatch() {
    isLocked = true;
    moves++;
    movesEl.innerText = moves;

    const [card1, card2] = flippedCards;
    const match = card1.dataset.emoji === card2.dataset.emoji;

    if (match) {
        // MATCH FOUND: Keep them flipped, make them green
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        matchedPairs++;
        flippedCards = []; // Clear array
        isLocked = false;  // Unlock immediately

        if (matchedPairs === EMOJIS.length) {
            setTimeout(endGame, 500);
        }
    } else {
        // NO MATCH: Flip back after 1 second
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

// 5. Timer & Helpers
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timeEl.innerText = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function endGame() {
    stopTimer();
    document.getElementById('final-moves').innerText = moves;
    document.getElementById('final-time').innerText = timeEl.innerText;
    overlay.classList.remove('hidden');
}

function restartGame() {
    overlay.classList.add('hidden');
    stopTimer();
    seconds = 0;
    moves = 0;
    matchedPairs = 0;
    movesEl.innerText = '0';
    timeEl.innerText = '00:00';
    flippedCards = [];
    isLocked = false;
    initGame();
}

// Start
initGame();
