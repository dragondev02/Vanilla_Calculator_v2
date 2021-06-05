// Binding DOM elements
    const operands = document.querySelector(".operands");

    const numbers = document.querySelectorAll(".number");
    const operators = document.querySelectorAll(".operator");

    const allClear = document.querySelector(".allClear");

    const clear = document.querySelector(".clear");

    const decimal = document.querySelector('[data-dec="."]');

    const equal = document.querySelector('[data-res="="]');



// Declaring the values that the calculator is going to work with
    let firstnum;
    let operator;
    let secondnum;

    // Purpose of previousKey: Used to always store the last number in the number variable instead of an operator.
    let previousKey;

    // Purpose of reset: If reset is true, then the next numbers should replace the ones already on the screen.
    let reset = 0;

    // Purpose of must operate: If more than one operator is used, store the result of the previous operation in the first number variable.
    let mustOperate = 0;

    // Purpose of lock: Quickfix against spamming the equal button.
    let lock;

    // Purpose of decimal allowed: If there is no decimal point in the string, the user can add one.
    let decimalAllowed = true;


    










            // MAIN

// Let base value on the screen be 0 
    firstnum = 0;
    operands.textContent = "0";

// Listen for key presses and append the pressed numbers   

    window.addEventListener("keydown", appendNum); // This is for key presses

    numbers.forEach(element => element.addEventListener("click", clickNum));


// When an operator is pressed, append it to the screen and store the first number

    window.addEventListener("keydown", appendOperator);

    operators.forEach(element => element.addEventListener("click", clickOperator));


// Perform the calculation when the user presses or clicks the equal button

    equal.addEventListener("click", operate);

    window.addEventListener("keydown", function(e)
    {
        if (e.key === "Enter") operate(equal);
    });

// Delete the last number when backspace or clear is used

    clear.addEventListener("click", backspace);

    window.addEventListener("keydown", function(e)
    {
        if (e.key === "Backspace") backspace(clear);
    });

// Reset everything to default when ESC or allclear is pressed

    allClear.addEventListener("click", resetall);

    window.addEventListener("keydown", function (e)
    {
        if (e.key === "Escape") resetall(allClear);
    })

// Add a decimal to the numbers. The function makes sure only one decimal point can be appended / number.

    decimal.addEventListener("click", decimalAdd);

    window.addEventListener("keydown", function(e)
    {
        if (e.key === "." || e.key === ",") decimalAdd(decimal);
    });















            // FUNCTIONS


// Append number when corresponding key is pressed down. If the input value is 0 or reset is true, replace it.
function appendNum(e)
{   
    let key = document.querySelector(`button[data-key="${e.key}"]`);

    // Run if the above specified key exists in the html file
    if ( key != null ){

            //Add some effects to the button when pressed
            active(key);

        key = key.textContent.replace(/ /g, '');

        if (reset || operands.textContent == "0"){
            operands.textContent = '';
            reset = 0;
            lock = 0;
        } 

        if (operands.textContent.length < 12 && !reset){
        operands.append(key);

        previousKey = "number";}

        if (key != null) console.log(key);
    }
}


// Append num when button is clicked. If the input value is 0 or reset is true, replace it.
function clickNum()
{
    let txt = this.textContent.replace(/ /g, '');

    if (reset || operands.textContent == "0"){
        operands.textContent = '';
        reset = 0;
        lock = 0;
    } 

    if (operands.textContent.length < 12 && !reset){
    operands.append(txt);

    previousKey = "number";}
}



// Reset the screen. Store the pressed operator.
function appendOperator(e)
{
    let key = document.querySelector(`button[data-op="${e.key}"]`);

    // Run if the above specified key exists in the html file
    if ( key != null ){
        
            //Add some effects to the button when pressed
            active(key);

        // Select appropriate key text
        key = key.textContent.replace(/ /g, '');

        // Convert the text on screen into a float if the last key is a number.
        if (previousKey == "number"){

            // If this is the first operator, then simply store the first number.
            if (!mustOperate){
                firstnum = parseFloat(operands.textContent);
                mustOperate = 1;
            }
            // If an operator was already used, operate on the first two numbers before continuing.
            else if (mustOperate){
                operate();
                firstnum = parseFloat(operands.textContent);
            }
            
            previousKey = "operator";
            reset = 1;
            lock = 0;
        }

        // Store the operator. 
        operator = key;
        decimalAllowed = true;
    }
}


// Append operator when clicked
function clickOperator(){

    // Convert the text on screen into a float if the last key is a number.
    if (previousKey == "number"){


        if (!mustOperate){
            firstnum = parseFloat(operands.textContent);
            mustOperate = 1;
        }
        else if (mustOperate){
            operate();
            firstnum = parseFloat(operands.textContent);
        }
        
        previousKey = "operator";
        reset = 1;
        lock = 0;

    }

    // Store the operator. 
    operator = this.textContent.replace(/ /g, '');
    decimalAllowed = true;
};



// Perform a calculation based on the operator type, then lock the function until another number is typed.
function operate (){

    active(equal);

    if (lock || !operator || previousKey === "operator") return;

    secondnum = parseFloat(operands.textContent);

    if (operator === "+"){
        firstnum = firstnum + secondnum;
    }
    else if (operator === "-"){
        firstnum = firstnum - secondnum;
    }
    else if (operator === "%"){
        firstnum = firstnum % secondnum;
    }
    else if (operator === "*"){
        firstnum = firstnum * secondnum;
    }
    else{
        firstnum = firstnum / secondnum;
    }

    operands.textContent = Math.round(firstnum * 10) / 10;

    decimalAllowed = true;
    lock = 1;
    reset = 1;
};


// Turn the string of numbers into an array and remove the last element
function backspace (){

    // Add button effect
    active(clear);

    if (operands.textContent.length > 1){

        let str = Array.from(operands.textContent);
        str = str.slice(0, str.length-1);
        str = str.toString();
        str = str.replace(/,/g, '');

        operands.textContent = parseFloat(str);
    }
}


// Reset every value to default
function resetall()
{

    // Add button effect
    active(allClear);

    firstnum = 0;
    operands.textContent = firstnum;
    console.log (firstnum);

    decimalAllowed = true;
    previousKey = operator;
    lock = 1;
    reset = 1;

    mustOperate = 0;

}

// Add a decimal point to the screen. Only one can be added in a string of numbers.

function decimalAdd(decimal)
{
    // Add on-screen effect
    active(decimal);

    if (decimalAllowed && previousKey === "number" && !lock){

        operands.append(".");
        decimalAllowed = false;
    }
}


// Adds a box shadow and background color for a short time

function active(value)
{
    value.classList.add("playing");

    setTimeout(() => {
        value.classList.remove("playing");
    }, 150);
}

// TBD: CSS: Breakpoints or size fix


