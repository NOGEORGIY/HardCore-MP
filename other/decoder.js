const fs = require('fs');
let data = fs.readFileSync(0, 'utf-8')

function parseGiantString(str) {
    const inputData = {};
    const lines = str.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
        const [key, valuesStr] = line.split(':').map(part => part.trim());
        if (!key || !valuesStr) continue;
        
        const values = valuesStr.split(' ').filter(val => val !== '');
        inputData[key] = values;
    }
    
    return inputData;
}

const inputData = parseGiantString(data);

const reverseReplacementMap = {
    'a': '12', 'b': '13', 'c': '14', 'd': '15', 'e': '16', 'f': '17', 'g': '18', 'h': '19',
    'i': '21', 'j': '22', 'k': '23', 'l': '24', 'm': '25', 'n': '26', 'o': '27', 'p': '28', 'q': '29',
    'r': '31', 's': '32', 't': '33', 'u': '34', 'v': '35', 'w': '36', 'x': '37', 'y': '38', 'z': '39',
    'A': '41', 'B': '42', 'C': '43', 'D': '44', 'E': '45', 'F': '46', 'G': '47', 'H': '48', 'I': '49',
    'J': '51', 'K': '52', 'L': '53', 'M': '54', 'N': '55', 'O': '56', 'P': '57', 'Q': '58', 'R': '59',
    'S': '61', 'T': '62', 'U': '63', 'V': '64', 'W': '65', 'X': '66', 'Y': '67', 'Z': '68', 'а': '69',
    'б': '71', 'в': '72', 'г': '73', 'д': '74', 'е': '75', 'ж': '76', 'з': '77', 'и': '78', 'й': '79',
    '!': '81', '@': '82', '#': '83', '$': '84', '%': '85', '^': '86', '&': '87', '*': '88', '(': '89',
    ')': '91', '-': '92', '_': '93', '=': '94', '+': '95', '[': '96', ']': '97', '{': '98', '}': '99'
};


const decodedData = {}


function decodeString(str) {
    let result = '';
    for (const char of str) {
        if (reverseReplacementMap[char]) {
            result += reverseReplacementMap[char];
        } else {
            // Если символ не найден в карте, оставляем как есть
            result += char;
        }
    }
    return result;
}


for (const key in inputData) {
    decodedData[key] = inputData[key].map(item => decodeString(item));
}



const invertedDataWithCharArrays = {};

for (const originalKey in decodedData) {
    for (const decodedValue of decodedData[originalKey]) {
        // Разбиваем строку на массив символов
        const charArray = Array.from(originalKey);
        


        invertedDataWithCharArrays[decodedValue] = charArray;
    }
}
