// Leon Miao
// calculator_s.js
// ver 1.0
// 2/7/2015

// get all keys from span
var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', 'x', '/'];
var decimal_added = false;
var decimal_added_entry = false;
var answer = '';
var last_entry = '';

// add onclick to all the keys and their operations
for (var i = 0; i < keys.length; ++i) {
	keys[i].onclick = function(e) {
        
        // get the input and key values
        var input = document.querySelector('.screen');
        var input_value = input.innerHTML;
        var key_value = this.innerHTML;

        // clear the screen before input when any messages returned
        if (input.innerHTML == "ERR:SYNTAX" || 
            input.innerHTML == "Infinity" || 
            input.innerHTML == "-Infinity" ||
            input.innerHTML == "NaN"){
            input.innerHTML = '';
            decimal_added = false;
        }   

        // if clear key is pressed, clear everything
        if(key_value == 'C') {
            input.innerHTML = '';
            decimal_added = false;
        }
        
        // retrieve the last answer
        else if (key_value == "ANS") {
            input.innerHTML = answer;
            decimal_added = (answer.indexOf('.') > -1) ? true : false;         
        }

        // retrieve the last entry
        else if (key_value == "ENTRY") {
            input.innerHTML = last_entry;
            decimal_added = decimal_added_entry;
        }
        
        // backspace/delete
        else if (key_value == '\u2190') {
            var temp_input_value = input.innerHTML;
            var last_char = temp_input_value[temp_input_value.length - 1];            
            input.innerHTML = temp_input_value.substring(0, temp_input_value.length - 1);
            if (last_char == '.')
                decimal_added = false;
        }

        // if equals key is pressed, calculate and display the result
        else if (key_value == '=') {
            var equation = input_value;
            var lastChar = equation[equation.length - 1];

            // replace all 'x' with '*' before computation
            equation = equation.replace(/x/g, '*');

            // if the last char the equation an operator or a decimal, remove it
            if (operators.indexOf(lastChar) > -1 || lastChar == '.')
                equation = equation.replace(/.$/, '');

            var temp_entry = equation; // get the equation for ENTRY

            if (equation) {
                try {
                    input.innerHTML = eval((eval(equation)).toFixed(6));
                } catch (e) {
                    if (e instanceof SyntaxError) 
                        input.innerHTML = "ERR:SYNTAX";
                }
            }
            
            var eval_result = input.innerHTML;
            if (eval_result.indexOf('(') > -1 || eval_result.indexOf(')') > -1){
                input.innerHTML = "ERR:SYNTAX";
                decimal_added = false;
            }
            
            // store data for ANS and ENTRY
            if (input.innerHTML != "ERR:SYNTAX" && 
                input.innerHTML != "Infinity" &&
                input.innerHTML != "-Infinity" &&
                input.innerHTML != "NaN" &&
                input.innerHTML != ''){
                answer = input.innerHTML; 
                last_entry = temp_entry;
                decimal_added_entry = decimal_added;
                decimal_added = (answer.indexOf('.') > -1) ? true : false;
            } 
        }

        // computational operator is pressed
        else if (operators.indexOf(key_value) > -1) {
            // get the last character from the equation
            var lastChar = input_value[input_value.length - 1];

            // only add operator if input is not empty and no operator at the end
            if (input.innerHTML != '' && operators.indexOf(lastChar) == -1) {
                    input.innerHTML += key_value;   
            }
            // '-' is allowed to input negatives if empty
            else if (input_value == '' && key_value == '-') 
                input.innerHTML += key_value;

            // replace the last operator with the newly pressed operator
            if (operators.indexOf(lastChar) > -1 && input_value.length > 1) {
                // if the end is a operator, replace it with a newly pressed one
                input.innerHTML = input_value.replace(/.$/, key_value);
            }
            decimal_added =false;
        }

        // if decimal point is pressed
        else if (key_value == '.') {
            if (!decimal_added) {
                input.innerHTML += key_value;
                decimal_added = true;
            }
        }

        // append other keys into the equation
        else {
            // adding 0, check if it's leading 0 or right after an operation
            if (key_value == '0'){
                // if it's leading 0
                if (input.innerHTML == ''){
                    input.innerHTML += "0.";
                    decimal_added = true;
                } 
                // not leading 0 but the last char is an operation
                else if (operators.indexOf(input_value[input_value.length-1]) > -1 ){  
                    input.innerHTML += "0.";
                    decimal_added = true;
                } 
                else 
                    input.innerHTML += key_value;
            } 
            // adding keys other than 0
            else {
                // if the last answer was 0, decimal point added before new keys
                if (input.innerHTML == '0'){
                    input.innerHTML += '.';
                    decimal_added = true;
                }
                input.innerHTML += key_value;
            }
        }
        // prevent page jumps
        e.preventDefault();   
    } 
}