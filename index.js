let keys = document.querySelectorAll('.keys');
let spaceKey = document.querySelector('.space_key');
let shift_left = document.querySelector('.shift_left');
let shift_right = document.querySelector('.shift_right');
let caps_lock_key = document.querySelector('.caps_lock_key');
let toggle_circle = document.querySelector('.toggle_circle');
let night_mode = document.querySelector('.night_mode');
let body = document.querySelector('body');
// let text_input = document.querySelector('#text');
let change_color = document.querySelector('.change_light_color');
let colors_input = document.querySelector('.colors_input');
let keyboard_lights = document.querySelector('.keyboard_lights');
let keyboard_wrapp = document.querySelector('.keyboard_wrapp');

for(let i = 0; i < keys.length; i++) {
    keys[i].setAttribute('keyname', keys[i].innerText);
    keys[i].setAttribute('lowerCaseName', keys[i].innerText.toLowerCase());
}

const text_input = document.getElementById('textInput');
let currentlyPressedKeys = new Set();
let lastConsonant = '';
let rightShiftStartTime = 0; // Time tracking for right shift
const longPressDuration = 500; // Duration for long press detection

const hindiVowels = {
    '1': 'अ', '2': 'आ', '3': 'इ', '4': 'ई', '5': 'उ',
    '6': 'ऊ', '7': 'ए', '8': 'ऐ', '9': 'ओ', '0': 'औ'
};

const hindiVowelDiacritics = {
    '1': 'ा', '2': 'ि', '3': 'ी', '4': 'ु', '5': 'ू',
    '6': 'े', '7': 'ै', '8': 'ो', '9': 'ौ', '0': 'ं'
};

const hindiKeyMap = {
    'q': 'झ', 'w': 'भ', 'e': 'घ', 'r': 'ढ', 't': 'ध', 
    'y': 'ज', 'u': 'ब', 'i': 'ग', 'o': 'ड', 'p': 'द',
    'a': 'ख', 's': 'फ', 'd': 'छ', 'f': 'ठ', 'g': 'थ', 
    'h': 'च', 'j': 'ट', 'k': 'त', 'l': 'व',
    'z': 'क', 'x': 'प', 'c': 'य', 'v': 'श', 'b': 'ष', 'n': 'स', 'm': 'र',
    'MetaRight': 'ह', 'AltRight': 'ल'
};

document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    const code = event.code;
    const pos = textInput.selectionStart;

    currentlyPressedKeys.add(key);

    if (event.getModifierState("CapsLock") && hindiVowels.hasOwnProperty(key)) {
        event.preventDefault();
        insertTextAtCursor(hindiVowels[key]);
    } else if (hindiKeyMap[key] && !currentlyPressedKeys.has("Shift")) {
        event.preventDefault();
        insertTextAtCursor(hindiKeyMap[key]);
        lastConsonant = key;
    } else if (hindiVowelDiacritics[key] && currentlyPressedKeys.has(lastConsonant)) {
        event.preventDefault();
        modifyLastConsonantWithDiacritic(hindiVowelDiacritics[key]);
        lastConsonant = '';
    }
});

document.addEventListener('keyup', function(event) {
    const key = event.key.toLowerCase();
    const code = event.code;
    currentlyPressedKeys.delete(key);

    if (code === 'ShiftRight') {
        handleRightShiftRelease();
    } else if (key === lastConsonant) {
        lastConsonant = ''; // Reset the last consonant on key up
    }
});

function handleRightShiftRelease() {
    const duration = Date.now() - rightShiftStartTime;
    const character = duration >= longPressDuration ? 'न' : 'म';
    insertTextAtCursor(character);
}

function insertTextAtCursor(text) {
    const start = textInput.selectionStart;
    const end = textInput.selectionEnd;
    const textBefore = textInput.value.substring(0, start);
    const textAfter = textInput.value.substring(end);
    textInput.value = textBefore + text + textAfter;
    textInput.selectionStart = textInput.selectionEnd = start + text.length;
}

function modifyLastConsonantWithDiacritic(diacritic) {
    const text = textInput.value;
    const position = text.lastIndexOf(hindiKeyMap[lastConsonant]);
    if (position !== -1) {
        textInput.value = text.substring(0, position + 1) + diacritic + text.substring(position + 1);
        textInput.setSelectionRange(position + 2, position + 2);
    }
}


window.addEventListener('keyup', function(e) {
    for(let i = 0; i < keys.length; i++) {
        if(e.key == keys[i].getAttribute('keyname' ) || e.key == keys[i].getAttribute('lowerCaseName')) {
            keys[i].classList.remove('active')
            keys[i].classList.add('remove')
        }
        if(e.code == 'Space') {
            spaceKey.classList.remove('active');
            spaceKey.classList.add('remove');
        }
        if(e.code == 'ShiftLeft') {
            shift_right.classList.remove('active')
            shift_right.classList.remove('remove')
        }
        if(e.code == 'ShiftRight') {
            shift_left.classList.remove('active')
            shift_left.classList.remove('remove')
        }
        setTimeout(()=> {
            keys[i].classList.remove('remove')
        },200)
    }
})






night_mode.addEventListener('click',function() {
    toggle_circle.classList.toggle('active');
    body.classList.toggle('active');
    night_mode.classList.toggle('active');
    keyboard_wrapp.classList.toggle('active');
    text_input.classList.toggle('active');
    change_color.classList.toggle('active');
    for(let i = 0; i < keys.length; i++) {
        keys[i].classList.toggle('keys_night')
    }
})

colors_input.addEventListener('input',function() {
    for(let i = 0; i < keys.length; i++) {
        keys[i].style.color = colors_input.value
    }
    keyboard_lights.style.background = colors_input.value;
})