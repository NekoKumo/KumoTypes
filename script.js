const paragraphs = [
    // "only few hold last late both problem at about just general few at long how through feel a well child last head course around problem because but down you find last day become never just only this and way as end year again out also not between say can want also change present end could want house lead follow still first all program before have make line nation feel a well child last head",
    // "say can want also change present end could want house lead follow still first all program before have make line nation want change those he must use increase move public man than from line must they of develop late time not program line move point which word do day man head begin of good back show want these present part see even than very form need great around where hand face not even",
    // "point which word do day man head begin of good back show want these present part see even than very form need great around while also they place could must now might tell go number since own but a may while all world just general need group line during at hand increase set still work large increase become school program where hand face not even well course late both problem at about just",
    // "during at hand increase set still work large increase become school program where hand face not even well course may school person here too home very should use or well high work back play home by small also will run we set end little move small run small own group would need few most mean old last year child you might have see world where present know life before as into should at here",
    // "run small own group would need few most mean old last year child you might have see world where present know life small for the number each way right set any interest house new for before as into should at here long eye without small feel some only few hold last late both problem at about just general few at long how through feel a well child last head tell go number since own but a may"
];

async function fetchRandomQuote() {
    const cacheBuster = Math.random();
    
    const apiUrl = `https://api.quotable.io/random?cache=${cacheBuster}`;
    // const apiUrl = `https://www.adhesiontext.com/?cache=${cacheBuster}`;

    try {
        //Asynchronous HTTP request to the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //Ansynchonously parse the response body as JSON
        const data = await response.json();
        return data.content; // Return the fetched quote content
    } 
    
    catch (error) {
        console.error('Error fetching random quote:', error);
        return null; // Return null in case of an error
    }
}

async function addRandomQuote() {
    const randomQuote = await fetchRandomQuote();
    if (randomQuote !== null) {
        paragraphs.push(randomQuote); // Add the fetched quote content to the array
        // console.log(randomQuote); // Log the fetched quote content
        loadParagraph();
    }
}

// Call the function to fetch a random quote and add it to the array
addRandomQuote();

const typingText = document.querySelector(".typing-text p")
const inpField = document.querySelector(".wrapper .input-field")
const tryAgainBtn = document.querySelector(".content button")
const timeTag = document.querySelector(".time span b")
const mistakeTag = document.querySelector(".mistake span")
const wpmTag = document.querySelector(".wpm span")
const cpmTag = document.querySelector(".cpm span")

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = mistakes = isTyping = 0;

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        console.log(char);
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0: wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

async function resetGame() {
    paragraphs.length = 0; // Clear the paragraphs array
    await addRandomQuote(); // Fetch and add a new random quote
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    loadParagraph();
}

// loadParagraph();
resetGame();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);