let hidden_phrase = '';
let total_char = 0;
let mistakes = 0;
let found = 0;
let tried_char = [];
const MAX_MISTAKES = 6;
const FORBIDDEN_SYMBOLS = ['@', '#', '$', '%', '&', '/', '(', ')', '=', '€'];

function cleanVowel(char) {
    char = char.toLowerCase();
    if ('áàâä'.includes(char)) return 'a';
    if ('éèêë'.includes(char)) return 'e';
    if ('íìîï'.includes(char)) return 'i';
    if ('óòôö'.includes(char)) return 'o';
    if ('úùûü'.includes(char)) return 'u';
    return char;
}

function updateHearts() {
    let heartsHtml = '';
    let lives = MAX_MISTAKES - mistakes;

    for (let i = 0; i < lives; i++) {
        heartsHtml += '❤️';
    }

    for (let i = 0; i < mistakes; i++) {
        heartsHtml += '🖤';
    }

    document.getElementById('lives_display').innerHTML = heartsHtml;
}

function updateDangerEffects() {
    let backgroundColors = [
        '#142641', // sin fallos
        '#1a2238', // 1 fallo
        '#1f1e2f', // 2 fallos
        '#251b25', // 3 fallos
        '#2a171c', // 4 fallos
        '#301313', // 5 fallos
        '#1a1a1a'  // derrota
    ];

    document.body.style.backgroundColor = backgroundColors[mistakes];

    let gameContainer = document.querySelector('.container');
    if (mistakes === MAX_MISTAKES - 1) {
        gameContainer.classList.add('danger-zone');
    } else {
        gameContainer.classList.remove('danger-zone');
    }

    if (found == total_char) {
        gameContainer.classList.remove('danger-zone');
        gameContainer.classList.add('victory-background');
    }
}

function nameMenu() {
    let player = document.getElementById('in_name_a').value;
    let hider = document.getElementById('in_name_b').value;

    if (player.length < 3 || hider.length < 3) {
        alert('Ambos nombres deben tener al menos 3 caracteres.');
        return;
    }

    document.getElementById('out_name_a').textContent = player;
    document.getElementById('out_name_b').textContent = hider;
    document.querySelector('.name_menu').style.display = 'none';
    document.querySelector('.phrase_menu').style.display = 'block';
}

function hidePhrase() {
    let input_text = document.getElementById('in_phrase').value;
    for (let i = 0; i < FORBIDDEN_SYMBOLS.length; i++) {
        if (input_text.includes(FORBIDDEN_SYMBOLS[i])) {
            alert('La frase contiene símbolos no permitidos.');
            return;
        }
    }

    if (input_text.length <= 3) {
        alert('Tu palabra o frase es demasiado corta');
        return;
    }

    hidden_phrase = input_text.replaceAll(' ', '-');
    total_char = hidden_phrase.length;
    found = 0;
    mistakes = 0;
    tried_char = [];
    updateHearts();
    updateDangerEffects();
    document.getElementById('wrong_char').innerHTML = '';
    document.getElementById('total_char').textContent = total_char;

    let html = '';
    for (let i = 0; i < hidden_phrase.length; i++) {
        if (hidden_phrase[i] == '-') {
            html += '<span>-</span>';
            found++;
        } else if (hidden_phrase[i] == '!') {
            html += '<span>!</span>';
            found++;
        } else if (hidden_phrase[i] == '?') {
            html += '<span>?</span>';
            found++;
        } else {
            html += '<span class="char_case"></span>';
        }
    }

    document.getElementById('phrase_display').innerHTML = html;
    document.getElementById('correct_char').textContent = found;

    document.querySelector('.phrase_menu').style.display = 'none';
    document.querySelector('.game_screen').style.display = 'block';
}

function checkCharacter() {
    let input = document.getElementById('in_char');
    let char = cleanVowel(input.value);

    if (!char) {
        return;
    }

    if (tried_char.includes(char)) {
        alert('Ya has probado con esa letra');
        input.value = '';
        return;
    }

    tried_char.push(char);
    let spans = document.querySelectorAll('#phrase_display span');
    let hit = false;

    for (let i = 0; i < hidden_phrase.length; i++) {
        if (cleanVowel(hidden_phrase[i]) == char) {
            spans[i].textContent = hidden_phrase[i];
            found++;
            hit = true;
        }
    }

    if (hit) {
        document.getElementById('correct_char').textContent = found;
        if (found == total_char) {
            alert('¡Has adivinado la frase!');
            input.disabled = true;
        }
    } else {
        mistakes++;
        updateHearts();
        updateDangerEffects();
        document.getElementById('wrong_char').innerHTML += '<p class="wrong_char_case">' + char + '</p>';
        if (mistakes == MAX_MISTAKES) {
            alert('Has perdido...');
            input.disabled = true;
        }
    }

    input.value = '';
    input.focus();
}

function addEnterListener(inputId, buttonId) {
    document.getElementById(inputId).addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById(buttonId).click();
        }
    });
}

document.getElementById('btn_names').onclick = nameMenu;
document.getElementById('btn_phrase').onclick = hidePhrase;
document.getElementById('btn_char').onclick = checkCharacter;

addEnterListener('in_name_a', 'btn_names');
addEnterListener('in_name_b', 'btn_names');
addEnterListener('in_phrase', 'btn_phrase');
addEnterListener('in_char', 'btn_char');