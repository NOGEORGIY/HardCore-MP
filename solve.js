function convertToRanks(matrix) {
    // Собираем все элементы в один массив с сохранением их позиций
    const elements = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            elements.push({
                value: matrix[i][j],
                row: i,
                col: j
            });
        }
    }
    
    // Сортируем элементы по значению, а при равенстве - по позиции в матрице
    elements.sort((a, b) => {
        if (a.value !== b.value) return a.value - b.value;
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
    });
    
    // Присваиваем ранги (теперь они всегда уникальны)
    const rankMatrix = matrix.map(row => row.slice()); // Копируем структуру матрицы
    
    for (let rank = 0; rank < elements.length; rank++) {
        const {row, col} = elements[rank];
        rankMatrix[row][col] = rank + 1; // Ранги начинаются с 1
    }
    
    return rankMatrix;
}


// Функция для восстановления исходных значений
function restoreFromRanks(rankMatrix, originalMatrix) {
    // Собираем все элементы исходного массива с их позициями
    const elements = [];
    for (let i = 0; i < originalMatrix.length; i++) {
        for (let j = 0; j < originalMatrix[i].length; j++) {
            elements.push({
                value: originalMatrix[i][j],
                row: i,
                col: j
            });
        }
    }
    
    // Сортируем элементы так же, как при присвоении рангов
    elements.sort((a, b) => {
        if (a.value !== b.value) return a.value - b.value;
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
    });
    
    // Создаем мапу: ранг -> значение
    const rankToValue = new Map();
    for (let rank = 0; rank < elements.length; rank++) {
        rankToValue.set(rank + 1, elements[rank].value);
    }
    
    // Восстанавливаем значения
    return rankMatrix.map(row => row.map(rank => rankToValue.get(rank)));
}

//Парсит словарь матрица-команды
function parseData(content) { 
  const lines = content.split('\n');
  const result = {};
  
  lines.forEach(line => {
    // Разделяем строку на ключ и команды
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return; // Пропускаем строки без двоеточия
    
    const key = line.substring(0, colonIndex).trim();
    const commandsStr = line.substring(colonIndex + 1).trim();
    
    if (!key || !commandsStr) return;
    
    // Разбиваем команды по пробелам и фильтруем пустые строки
    const commands = commandsStr.split(/\s+/).filter(cmd => cmd.trim() !== '');
    
    result[key] = commands;
  });
  
  return result;
}

function reorderArrayBasedOnTemplate(template, target) {
    // Создаем массив пар с сохранением исходных индексов
    const paired = template.map((value, index) => ({ 
        templateValue: value, 
        targetValue: target[index],
        originalIndex: index 
    }));
    
    // Сортируем, сохраняя порядок для одинаковых значений
    paired.sort((a, b) => {
        if (a.templateValue === b.templateValue) {
            return a.originalIndex - b.originalIndex;
        }
        return a.templateValue - b.templateValue;
    });
    
    return paired.map(item => item.targetValue);
}

function fillArray(n, m) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < m; j++) {
            row.push((n - 1 - i) + j);
        }
        matrix.push(row);
    }
    return matrix;
}

function unflattenMatrix(flatArray, rows, cols) {
    if (flatArray.length !== rows * cols) {
        throw new Error("Невозможно восстановить матрицу: несоответствие размеров");
    }

    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const start = i * cols;
        const end = start + cols;
        const row = flatArray.slice(start, end);
        matrix.push(row);
    }
    return matrix;
}

function illegal_sorting(arr) {
    let rows = arr.length;
    let cols = arr[0].length;
    
    // Создаем эталонную матрицу
    let numeric_arr = fillArray(rows, cols);
    
    // Получаем плоские массивы
    let original_flat = arr.flat();
    let numeric_flat = numeric_arr.flat();
    
    // Сортируем исходные значения
    let sorted_original = [...original_flat].sort((a, b) => a - b);
    
    // Создаем карту: значение -> позиция в эталонной матрице
    let position_map = {};
    numeric_flat.forEach((val, idx) => {
        if (!position_map[val]) position_map[val] = [];
        position_map[val].push(idx);
    });
    
    // Распределяем отсортированные значения по позициям эталонной матрицы
    let reordered = new Array(original_flat.length);
    Object.keys(position_map).sort((a,b) => a-b).forEach(val => {
        let positions = position_map[val];
        let values = sorted_original.splice(0, positions.length);
        values.forEach((v, i) => {
            reordered[positions[i]] = v;
        });
    });
    
    // Восстанавливаем матрицу
    let perfect_matrix = unflattenMatrix(reordered, rows, cols);
    return perfect_matrix
}

function position_for_4(array, pos) {
    return (pos[0] in array 
         && pos[0]+1 in array 
         && pos[1] in array[pos[0]]
         && pos[1] in array[pos[0]+1]
         && pos[1]+1 in array[pos[0]]
         && pos[1]+1 in array[pos[0]+1]);
}

function rot(array, pos) {
    // Create a deep copy of the array
    let temp_arr = array.map(row => [...row]);
    if (position_for_4(array, pos)) {
        let a = array[pos[0]][pos[1]];
        let b = array[pos[0]][pos[1]+1];
        let d = array[pos[0]+1][pos[1]];
        let c = array[pos[0]+1][pos[1]+1];
        temp_arr[pos[0]][pos[1]] = d;
        temp_arr[pos[0]][pos[1]+1] = a;
        temp_arr[pos[0]+1][pos[1]] = c;
        temp_arr[pos[0]+1][pos[1]+1] = b;
    }
    return temp_arr;
}

function swapH(array, pos) {
    let temp_arr = array.map(row => [...row]);
    if (position_for_4(array, pos)) {
        let a = array[pos[0]][pos[1]];
        let b = array[pos[0]][pos[1]+1];
        let d = array[pos[0]+1][pos[1]];
        let c = array[pos[0]+1][pos[1]+1];
        temp_arr[pos[0]][pos[1]] = b;
        temp_arr[pos[0]][pos[1]+1] = a;
        temp_arr[pos[0]+1][pos[1]] = c;
        temp_arr[pos[0]+1][pos[1]+1] = d;
    }
    return temp_arr;
}

function swapV(array, pos) {
    let temp_arr = array.map(row => [...row]);
    if (position_for_4(array, pos)) {
        let a = array[pos[0]][pos[1]];
        let b = array[pos[0]][pos[1]+1];
        let d = array[pos[0]+1][pos[1]];
        let c = array[pos[0]+1][pos[1]+1];
        temp_arr[pos[0]][pos[1]] = d;
        temp_arr[pos[0]][pos[1]+1] = c;
        temp_arr[pos[0]+1][pos[1]] = a;
        temp_arr[pos[0]+1][pos[1]+1] = b;
    }
    return temp_arr;
}

function down_top(arr, pos){
  if (pos[0] == 1 && pos[1] == 0) return rot(swapH(rot(swapH(arr,[0,0]),[1,0]),[0,0]),[1,0])
  if (pos[0] == 1 && pos[1] == 1) return swapV(swapV(rot(rot(arr,[0,0]),[1,0]),[1,0]),[0,0])
  if (pos[0] == 1 && pos[1] == 2) return rot(swapV(swapH(arr,[0,0]),[1,1]),[0,0])
  if (pos[0] == 0 && pos[1] == 0) return rot(swapV(swapH(arr,[1,1]),[0,0]),[1,1])
  if (pos[0] == 0 && pos[1] == 1) return rot(swapV(swapH(swapV(arr,[0,0]),[1,1]),[0,0]),[1,1])
  if (pos[0] == 0 && pos[1] == 2) return rot(swapV(swapV(swapH(arr,[1,0]),[0,0]),[0,1]),[1,0])
}

function right_left(arr, pos){
  if (pos[0] == 0 && pos[1] == 1) return swapV(swapH(rot(rot(arr,[0, 0]),[0, 1]),[0, 1]),[0, 0]) 
  if (pos[0] == 0 && pos[1] == 0) return swapV(swapH(rot(arr,[1, 1]),[0, 0]),[1, 1])
  if (pos[0] == 1 && pos[1] == 0) return swapV(swapH(rot(swapH(arr,[0, 0]),[1, 1]),[0, 0]),[1, 1])
  if (pos[0] == 1 && pos[1] == 1) return swapV(swapV(rot(swapV(arr,[0, 0]),[0, 1]),[0, 0]),[0, 1])
  if (pos[0] == 2 && pos[1] == 1) return swapV(swapH(rot(arr,[0, 0]),[1, 1]),[0, 0])
  if (pos[0] == 2 && pos[1] == 0) return swapV(rot(swapV(swapV(arr,[1, 0]),[1, 1]),[1, 0]),[1, 1])
}

function NO_generateAllKeys(data) {
  const fullData = {};
  const keys = Object.keys(data);
  
  keys.forEach(key => {
    // Преобразуем строковый ключ обратно в матрицу
    const matrixValues = key;
    const matrixKey = unflattenMatrix(matrixValues, 3, 3);
    
    // Генерируем все вариации этой матрицы
    const allVariations = generateAllValidMatrices(matrixKey);
    
    // Для каждой вариации сохраняем оригинальные операции
    allVariations.forEach(variation => {
      fullData[variation] = data[key];
    });
  });
  
  return fullData;
}

function getDiagonals(matrix) {
 const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  const diagonals = [];

  // Проходим по всем возможным диагоналям (от -(cols - 1) до (rows - 1))
  for (let d = -(cols - 1); d < rows; d++) {
    const diagonal = [];

    // Находим индексы i и j, для которых i - j = d
    for (let i = Math.max(0, d); i < Math.min(rows, cols + d); i++) {
      const j = i - d;
      diagonal.push(matrix[i][j]);
    }

    diagonals.push(diagonal);
  }

  return diagonals;
}

function logic(arr_in) {
  let arr = arr_in
  //const reference_arr = illegal_sorting(arr);  
  const fs = require('fs');
  const reference_3_3_matrix_numeric = fillArray(3,3)
  let command_list = []
    let data = fs.readFileSync(0, 'utf-8')
    const parsedData = parseData(data);
    const fullData = parsedData;
    let flag_same = 0
    
    while(arr.length >= 3 && arr[0].length >= 3 && flag_same == 0) {
      for(let col = 0; col<arr.length-2; col++){
        for(let line = 0; line<arr[0].length-2; line++){
          let local_arr = [ [arr[col][line],arr[col][line+1],arr[col][line+2]]
                           ,[arr[col+1][line],arr[col+1][line+1],arr[col+1][line+2]],
                            [arr[col+2][line],arr[col+2][line+1],arr[col+2][line+2]] ]
          
          let numeric_local_arr = convertToRanks(local_arr)
          let string_numeric_local_arr = String(numeric_local_arr.flat(Infinity)).replace(/,/g, '');

          let local_arr_solve = fullData[string_numeric_local_arr]
          if (!local_arr_solve) {
                      let needArr = [[4,7,9],
                                     [3,5,8],
                                     [1,2,6]]

                      local_arr_solve = bfsSolve(local_arr, needArr, 8);
                        
                        if (!local_arr_solve) {
                            console.log("Решение не найдено даже через BFS");
                            continue;
                        }
                  }
          
          
          let solved_local_arr = local_arr

   
          for (let com = 0; com < local_arr_solve.length; com++){
            command = local_arr_solve[com]
            switch (command) {
    case '1':
        //1
        solved_local_arr = rot(solved_local_arr, [0, 0])
        command_list.push("rot" + String(col + 0) + String(line + 0))
        break
    case '2':
        //2
        solved_local_arr = swapH(solved_local_arr, [0, 0])
        command_list.push("swapH" + String(col + 0) + String(line + 0))
        break
    case '3':
        //3
        solved_local_arr = swapV(solved_local_arr, [0, 0])
        command_list.push("swapV" + String(col + 0) + String(line + 0))
        break
    case '4':
        //4
        solved_local_arr = rot(solved_local_arr, [1, 0])
        command_list.push("rot" + String(col + 1) + String(line + 0))
        break
    case '5':
        //5
        solved_local_arr = swapH(solved_local_arr, [1, 0])
        command_list.push("swapH" + String(col + 1) + String(line + 0))
        break
    case '6':
        //6
        solved_local_arr = swapV(solved_local_arr, [1, 0])
        command_list.push("swapV" + String(col + 1) + String(line + 0))
        break
    case '7':
        //7
        solved_local_arr = rot(solved_local_arr, [0, 1])
        command_list.push("rot" + String(col + 0) + String(line + 1))
        break
    case '8':
        //8
        solved_local_arr = swapH(solved_local_arr, [0, 1])
        command_list.push("swapH" + String(col + 0) + String(line + 1))
        break
    case '9':
        //9
        solved_local_arr = swapV(solved_local_arr, [0, 1])
        command_list.push("swapV" + String(col + 0) + String(line + 1))
        break
    case 'a':
        // a
        solved_local_arr = rot(solved_local_arr, [1, 1])
        command_list.push("rot" + String(col + 1) + String(line + 1))
        break
    case 'b':
        // b
        solved_local_arr = swapH(solved_local_arr, [1, 1])
        command_list.push("swapH" + String(col + 1) + String(line + 1))
        break
    case 'c':
        // c
        solved_local_arr = swapV(solved_local_arr, [1, 1])
        command_list.push("swapV" + String(col + 1) + String(line + 1))
        break
          }
            
            
          } //тут решился локальный массив
          arr[col][line] = solved_local_arr[0][0]
          arr[col][line+1] = solved_local_arr[0][1]
          arr[col][line+2] = solved_local_arr[0][2]
          arr[col+1][line] = solved_local_arr[1][0]
          arr[col+1][line+1] = solved_local_arr[1][1]
          arr[col+1][line+2] = solved_local_arr[1][2]
          arr[col+2][line] = solved_local_arr[2][0]
          arr[col+2][line+1] = solved_local_arr[2][1]
          arr[col+2][line+2] = solved_local_arr[2][2]


        } 
      }//Тут прошла первая сортировка форами
      let reference_arr = illegal_sorting(arr)
      let ref_diag = getDiagonals(reference_arr)
      let orig_arr_diag = getDiagonals(arr)
      flag_same = 1;
      for (let diag = 0; diag < orig_arr_diag.length; diag++) {
        if (!(JSON.stringify(orig_arr_diag[diag].sort()) === JSON.stringify(ref_diag[diag].sort()))) {
            flag_same = 0;
          }
      }
    }
    console.log("fin")
    console.table(arr)
    console.log("количество команд:" + command_list)
}              

  
test = 
[  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
  [1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
  [2, 2, 2, 3, 3, 2, 2, 3, 3, 2],
  [2, 3, 3, 2, 1, 1, 3, 3, 3, 2],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1],
  [2, 1, 2, 2, 1, 2, 1, 2, 1, 2],
  [3, 1, 2, 3, 1, 3, 1, 3, 1, 3],
  [1, 1, 3, 1, 3, 1, 3, 1, 1, 1],
  [3, 1, 1, 3, 3, 1, 3, 3, 1, 3],
  [1, 1, 1, 3, 3, 1, 1, 1, 3, 1]]
logic(test)
