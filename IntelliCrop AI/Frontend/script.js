let lastBotMessage = "";
let largeMode = false;

// Load voices properly
window.speechSynthesis.onvoiceschanged = () => {
window.speechSynthesis.getVoices();
};

// Speech function
function speak(text){

const speech = new SpeechSynthesisUtterance(text);

let voices = window.speechSynthesis.getVoices();
let hindiVoice = voices.find(v => v.lang === "hi-IN");

if(hindiVoice){
speech.voice = hindiVoice;
}

speech.rate = 0.85;
speech.pitch = 1;

window.speechSynthesis.cancel();
window.speechSynthesis.speak(speech);

}


// Large text mode
function increaseText(){

largeMode = !largeMode;

let size = largeMode ? "20px" : "16px";

document.body.style.fontSize = size;

let elements = document.querySelectorAll("p, li, label, button, input, h1, h2");

elements.forEach(el=>{
el.style.fontSize = size;
});

}


document.addEventListener("DOMContentLoaded", () => {

const ids = ["nitrogen","phosphorus","potassium"];

ids.forEach(id=>{

const slider = document.getElementById(id);
const value = document.getElementById(id+"-value");

value.textContent = slider.value;

slider.addEventListener("input",()=>{
value.textContent = slider.value;
});

});


// Chart
const ctx = document.getElementById("nutrient-chart");

const chart = new Chart(ctx,{
type:"bar",
data:{
labels:["Nitrogen","Phosphorus","Potassium"],
datasets:[{
label:"Soil Nutrients",
data:[50,40,60]
}]
}
});


// Soil Analysis
document.getElementById("analyze-btn").onclick = ()=>{

const N = document.getElementById("nitrogen").value;
const P = document.getElementById("phosphorus").value;
const K = document.getElementById("potassium").value;

chart.data.datasets[0].data=[N,P,K];
chart.update();

let crops="";
let fertilizer="";

if(P<30){
crops="Corn, Soybeans, Alfalfa";
fertilizer="Use phosphorus rich fertilizer";
}
else{
crops="Rice, Wheat, Maize";
fertilizer="Balanced fertilizer recommended";
}

document.getElementById("recommended-crops").innerText=
"Recommended Crops: "+crops;

document.getElementById("fertilizer-suggestion").innerText=
fertilizer;

};


// Chatbot
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-messages");

sendBtn.onclick = async ()=>{

const message = chatInput.value.trim();

if(!message) return;

const userMsg=document.createElement("div");
userMsg.className="user-message";
userMsg.textContent=message;

chatBox.appendChild(userMsg);

chatInput.value="";

try{

const res = await fetch("http://localhost:3000/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message})
});

const data = await res.json();

const botMsg=document.createElement("div");
botMsg.className="bot-message";

// Clean markdown
let cleanText = data.response
.replace(/\*\*/g, "")
.replace(/\*/g, "")
.replace(/#/g, "");

botMsg.textContent = cleanText;

lastBotMessage = cleanText;

chatBox.appendChild(botMsg);

chatBox.scrollTop = chatBox.scrollHeight;

}catch{

const error=document.createElement("div");
error.className="bot-message";
error.textContent="Server error. Check backend.";

chatBox.appendChild(error);

}

};


// Read Answer Button
document.getElementById("read-btn").onclick=()=>{

if(lastBotMessage===""){
alert("No answer yet");
return;
}

speak(lastBotMessage);

};


// Voice Input
document.getElementById("voice-btn").onclick=()=>{

const recognition=new webkitSpeechRecognition();

recognition.lang="hi-IN";

recognition.start();

recognition.onresult=(event)=>{

chatInput.value=event.results[0][0].transcript;

};

};

});
