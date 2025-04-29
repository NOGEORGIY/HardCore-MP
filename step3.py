from parsing import result

# Step 1: Read and parse the input file
data_dict = {}
with open('for_red.txt', 'r') as file:
    for line in file:
        line = line.strip()  # Remove whitespace and newlines
        if not line:
            continue  # Skip empty lines
        if ':' in line:
            key, values_str = line.split(':', 1)  # Split on first colon
            key = key.strip()
            values = values_str.strip().split()  # Split values into list
            data_dict[key] = values

# Step 2: Create unique set of value combinations
set_values = []
for key in data_dict:
    result = ''.join(data_dict[key])
    set_values.append(result)

set_values = set(set_values)
result_array = [list(item) for item in set_values]
result_strings = {''.join(chars) for chars in result_array}

# Step 3: Create mapping from value strings to original keys
new_dict = {}
for key, value_list in data_dict.items():
    value_str = ''.join(value_list)
    if value_str in result_strings:
        if value_str not in new_dict:
            new_dict[value_str] = []
        new_dict[value_str].append(key)

# Step 4: Create final dictionary with clean keys and trimmed values
final_dict = {}
for chars in result_array:
    chars_str = ''.join(chars)
    if chars_str in new_dict:
        key_length = len(chars_str)
        values = new_dict[chars_str]

        # Apply trimming rules based on key length
        if key_length == 3:  # Skip keys with 3 characters
            continue
        elif 4 <= key_length <= 5:  # Trim 3 values for 4-5 character keys
            trimmed_values = values[:-10] if len(values) > 10 else []
        elif 6 <= key_length <= 8:  # No trimming for 6-7 character keys
            trimmed_values = values
        else:  # Default case (trim nothing)
            trimmed_values = values

        # Only add if we have values left after trimming
        if trimmed_values:
            final_dict[chars_str] = trimmed_values

# Replacement mapping for number encoding
replacement_map = {
    '12': 'a', '13': 'b', '14': 'c', '15': 'd', '16': 'e', '17': 'f', '18': 'g', '19': 'h',
    '21': 'i', '22': 'j', '23': 'k', '24': 'l', '25': 'm', '26': 'n', '27': 'o', '28': 'p', '29': 'q',
    '31': 'r', '32': 's', '33': 't', '34': 'u', '35': 'v', '36': 'w', '37': 'x', '38': 'y', '39': 'z',
    '41': 'A', '42': 'B', '43': 'C', '44': 'D', '45': 'E', '46': 'F', '47': 'G', '48': 'H', '49': 'I',
    '51': 'J', '52': 'K', '53': 'L', '54': 'M', '55': 'N', '56': 'O', '57': 'P', '58': 'Q', '59': 'R',
    '61': 'S', '62': 'T', '63': 'U', '64': 'V', '65': 'W', '66': 'X', '67': 'Y', '68': 'Z', '69': 'а',
    '71': 'б', '72': 'в', '73': 'г', '74': 'д', '75': 'е', '76': 'ж', '77': 'з', '78': 'и', '79': 'й',
    '81': '!', '82': '@', '83': '#', '84': '$', '85': '%', '86': '^', '87': '&', '88': '*', '89': '(',
    '91': ')', '92': '-', '93': '_', '94': '=', '95': '+', '96': '[', '97': ']', '98': '{', '99': '}'
}

def replace_numbers_with_letters(s):
    result = []
    i = 0
    while i < len(s):
        if i + 2 <= len(s) and s[i:i+2] in replacement_map:
            result.append(replacement_map[s[i:i+2]])
            i += 2
        else:
            result.append(s[i])
            i += 1
    return ''.join(result)

# Step 5: Apply number replacement to all values
for key in final_dict:
    final_dict[key] = [replace_numbers_with_letters(val) for val in final_dict[key]]

# Step 6: Write output to file
with open('output_gonna_cry_smol_sad.txt', 'w') as file:
    for key, values in final_dict.items():
        # Key is already in clean format (no brackets/commas)
        # Values have been trimmed and encoded
        if values:  # Only write if there are values remaining after trimming
            file.write(f"{key}: {' '.join(values)}\n")


total_sum = 0
# 13c95aa
total_values = sum(len(values) for values in final_dict.values())
print(f"Общее количество значений: {total_values}")
