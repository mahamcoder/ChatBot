const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
let userMessage;
const API_KEY = 'AIzaSyB2oTRBZUO9EhV6OPge9PwT7J92ER11U-s';

const createChatli = (message, className) => {
    // create a chat <LI> element with passed message and className
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatcontent = className === 'outgoing' 
        ? `<p></p>` 
        : ` <span class="material-symbols-outlined">
                    <i style="font-size: 35px;" class="ri-gemini-fill"></i>
                </span><p></p>`;
    chatli.innerHTML = chatcontent;
    chatli.querySelector("p").textContent=message;
    return chatli;
}

const generateResponse = (incomingchatli) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement=incomingchatli.querySelector('p');

    
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      };
      
    fetch(API_URL,requestOptions)
        .then(res => res.json())
        .then(data => {
          messageElement.textContent=data.candidates[0].content.parts[0].text;
        })
        .catch(error => {
            messageElement.textContent="Oops! Something went wrong. please try again.";
        }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value='';
    // append the user's message to the chatbox
    chatbox.appendChild(createChatli(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);
    setTimeout(() => {
        // display "thinking..." message while waiting for the response
        const incomingchatli=createChatli("Thinking....", "incoming")
        chatbox.appendChild(incomingchatli);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingchatli);
    }, 600);
}
sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"))
closeBtn .addEventListener("click",()=>document.body.classList.remove("show-chatbot"))
