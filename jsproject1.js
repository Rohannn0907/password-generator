const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()_+{}[]<>?/,.';

//initially
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider(); //password length ko set krwata hai UI pr

//set strength circle to grey
 setIndicator("#ccc");
//set password length
function handleSlider(){  //password length ko UI pr display krwata hai ye
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow   
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){ 
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);    //charAt means character at that index
}
function calcStrength(){
    let hasUpper= false;
    let hasLower= false;
    let hasNum= false;
    let hasSym= false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;
     
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && 
    (hasNum || hasSym) &&
     passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(() => { 
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){ 
    //Fisher Yates Method 
    for(let i=array.length-1;i>0;i--){
        //random j, find out using random function
        const j=Math.floor(Math.random()*(i+1)); //math.random 0 se 1 ke beech me value deta hai
        //swap number at i index and j index
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}
 
function handleCheckBoxChange(){
    checkCount=0;  
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount==0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //let's start the journey of new password generation
    console.log("Starting the password generation");
    //remove old password
    password="";
    //let's put the stuff mentioned by checkbox
    let funcArr=[]; 
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);  
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);  
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber); 
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    //compulsory addition 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("Compulsory addition done");

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    console.log("Remaining addition done");

    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value=password; 
    console.log("UI addition done");
    //calculate strength after password generation
    calcStrength();
});







 



