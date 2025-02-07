const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes',
    'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon'
];

const WINNING_COMBINATIONS = [
    ['cherry', 'cherry', 'cherry'],
    ['lucky_seven', 'lucky_seven', 'lucky_seven'],
    ['big_win', 'big_win', 'big_win']
];

const WINNING_PROBABILITY = 0.2; // 20% chance to get a winning combination
const BASE_SPINNING_DURATION = 2.7; // Base spin time in seconds
const COLUMN_SPINNING_DURATION = 0.3; // Additional spin delay per column
const BASE_ITEM_AMOUNT = 40; // Minimum number of icons per column
const EXTRA_ITEMS_PER_COLUMN = 3; // Additional items per column
const RESULT_ITEM_COUNT = 3; // Number of result icons per column
const SPIN_COST = 1; // Cost per spin
const WIN_AMOUNT = 5; // Winning amount

let balance = 1000;
let cols;

document.addEventListener('DOMContentLoaded', () => {
    cols = document.querySelectorAll('.col');
    initializeColumns();
    updateBalanceDisplay();
});

function initializeColumns() {
    cols.forEach((col, i) => {
        const amountOfItems = BASE_ITEM_AMOUNT + i * EXTRA_ITEMS_PER_COLUMN;
        const items = Array.from({ length: amountOfItems }, getRandomIcon);

        // Append first RESULT_ITEM_COUNT icons at the end to create looping effect
        col.innerHTML = [...items, ...items.slice(0, RESULT_ITEM_COUNT)]
            .map(icon => createIconElement(icon)).join('');
    });
}

function createIconElement(icon) {
    return `<div class="icon" data-item="${icon}"><img src="items/${icon}.png" alt="${icon}"></div>`;
}

function spin(button) {
    if (balance < SPIN_COST) {
        alert('Not enough balance!');
        return;
    }

    balance -= SPIN_COST;
    updateBalanceDisplay();

    let duration = BASE_SPINNING_DURATION + getRandomDuration();
    button.disabled = true;
    document.getElementById('container').classList.add('spinning');

    cols.forEach(col => {
        duration += COLUMN_SPINNING_DURATION + getRandomDuration();
        col.style.animationDuration = `${duration}s`;
    });

    setTimeout(setResult, (BASE_SPINNING_DURATION * 500)); // Halfway through spin
    setTimeout(() => {
        document.getElementById('container').classList.remove('spinning');
        button.disabled = false;
    }, duration * 1000);
}

function setResult() {
    let isWin = Math.random() < WINNING_PROBABILITY;

    cols.forEach(col => {
        const results = isWin ? getWinningCombination() : getRandomCombination();
        const icons = col.querySelectorAll('.icon img');

        results.forEach((icon, i) => {
            icons[i].src = `items/${icon}.png`;
            icons[icons.length - RESULT_ITEM_COUNT + i].src = `items/${icon}.png`;
        });
    });

    if (isWin) {
        balance += WIN_AMOUNT;
        updateBalanceDisplay();
        setTimeout(() => {
            alert('You won!');
        }, 2500);
    }
}

function getWinningCombination() {
    return WINNING_COMBINATIONS[Math.floor(Math.random() * WINNING_COMBINATIONS.length)];
}

function getRandomCombination() {
    return Array.from({ length: RESULT_ITEM_COUNT }, getRandomIcon);
}

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function getRandomDuration() {
    return Math.random() * 0.09;
}

function updateBalanceDisplay() {
    document.querySelector('.sum').textContent = balance;
}
