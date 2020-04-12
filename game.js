var index = 1;
var attempt = 10;

async function answer(button) {
    answer1 = button.value

    axios.post("/answer", {answer:answer1})
    
    document.getElementById("letter" + index).innerHTML = answer1
    index++;
    

    if(index == 5){
        index = 1;
        startGame();
    };
}

async function startGame() {
    axios.get("/start")
    attempt = 10;
}


async function giveanswer(button) {
    answer1 = button.value

    axios.post("/start", {answer:answer1})
    
    document.getElementById("letter" + index).innerHTML = answer1
    document.getElementById("attempt").innerHTML = attempt
    index++;
    attempt--;

    if(index == 5){
        index = 1;
    };
}

async function getletter(){
    axios.post("/gamefinish")
    document.getElementById("letter1").innerHTML = "GET ANSWER"
    attempt = 10;
}
