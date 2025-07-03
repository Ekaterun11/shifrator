document.getElementById('generateKey').addEventListener('click', generateKey);
document.getElementById('execute').addEventListener('click', execute);
document.getElementById('copyResult').addEventListener('click', copyResult);
document.getElementById('saveResult').addEventListener('click', saveResult);
document.getElementById('showSteps').addEventListener('click', toggleSteps);
document.getElementById('inputFile').addEventListener('change', handleFile);

function generateKey() {
    const key = CryptoJS.lib.WordArray.random(32).toString();
    document.getElementById('key').value = key;
}

function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputText').value = e.target.result;
        };
        reader.readAsText(file);
    }
}

function execute() {
    const mode = document.getElementById('mode').value;
    const inputText = document.getElementById('inputText').value;
    const key = document.getElementById('key').value;
    const outputText = document.getElementById('outputText');
    const stepsContent = document.getElementById('stepsContent');

    if (!inputText || !key) {
        alert('Введите текст и ключ!');
        return;
    }

    if (key.length !== 32) {
        alert('Ключ должен быть 32 символа!');
        return;
    }

    let result, steps = [];
    try {
        if (mode === 'encrypt') {
         
            steps.push('1. Исходный текст: ' + inputText);
            const iv = CryptoJS.lib.WordArray.random(16); 
            steps.push('2. Генерация IV: ' + iv.toString());
            steps.push('3. Ключ: ' + key);

      
            const encrypted = CryptoJS.AES.encrypt(inputText, key, { iv: iv });
            result = iv.toString() + encrypted.ciphertext.toString();
            steps.push('4. Зашифрованный текст (с IV): ' + result);

            outputText.value = result;
        } else {
           
            steps.push('1. Зашифрованный текст: ' + inputText);
            steps.push('2. Ключ: ' + key);

            const iv = CryptoJS.enc.Hex.parse(inputText.slice(0, 32));
            const ciphertext = CryptoJS.enc.Hex.parse(inputText.slice(32));
            steps.push('3. Извлечение IV: ' + iv.toString());
            steps.push('4. Зашифрованные данные: ' + ciphertext.toString());

            const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, { iv: iv });
            result = decrypted.toString(CryptoJS.enc.Utf8);
            steps.push('5. Расшифрованный текст: ' + result);

            outputText.value = result;
        }
        stepsContent.textContent = steps.join('\n');
    } catch (e) {
        alert('Ошибка: ' + e.message);
        outputText.value = '';
        stepsContent.textContent = 'Ошибка при выполнении операции.';
    }
}

function copyResult() {
    const outputText = document.getElementById('outputText').value;
    navigator.clipboard.writeText(outputText).then(() => {
        alert('Результат скопирован!');
    });
}

function saveResult() {
    const outputText = document.getElementById('outputText').value;
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function toggleSteps() {
    const stepsDiv = document.getElementById('steps');
    stepsDiv.classList.toggle('hidden');
}