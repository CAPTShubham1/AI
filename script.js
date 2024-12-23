const chatInput =document.querySelector("#chat-input");
const sendbutton= document.querySelector("#send-btn");
const chatContainer= document.querySelector(".chat-container");
const themebutton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");


let userText = null;
const API_KEY = "AIzaSyB6n1tLBrwiCK5ZH41d6IXhmH5urAyue-U";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstroge=() =>{
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor==="light_mode");
    themebutton.innerText = document.body.classList.contains("light-mode") 
        ? "dark_mode" 
        : "light_mode";

        const defaultText=`<div class= "default-text">
        <h1>Developed by Shubham_Sharma</h1>
        <p>Jarvis welcome you in the world of techie .<br>Your chat history will be displayed here.</p>
         </div> `
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0,chatContainer.scrollHeight);

}
loadDataFromLocalstroge();

const creatElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
};

const getChatResponse = async (outgoingChatdiv) => {
    // Ensure the .text element exists
    const textElement = document.createElement("p");
    textElement.classList.add("text"); // Add class to ensure consistency
    outgoingChatdiv.querySelector(".chat-details").appendChild(textElement);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userText }]
                    }
                ]
            })
        });

        const data = await response.json();

        
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "No response from AI.";
        textElement.innerText = apiResponse; // Use correct property (innerText)
        console.log(apiResponse);
    } catch (error) {
        console.error("Error fetching response:", error);
        textElement.innerText = "Error: Unable to get a response from the server.";
    }

    // Remove typing animation
    outgoingChatdiv.querySelector(".typing-animation").remove();
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    localStorage.setItem("all-chats",chatContainer.innerHTML);
}; 

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentNode.querySelector(".text");
    if (responseTextElement) {
        navigator.clipboard.writeText(responseTextElement.innerText).then(() => {
            copyBtn.innerText = "done";
            setTimeout(() => (copyBtn.innerText = "content_copy"), 1000);
        });
    }
};

const showTypingAnimation =() => {
    const html= ` <div class="chat-content">
    <div class="chat-details">
       <img src="images/OIP.jpg" alt="OIP-img">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay:0.2s"></div>
            <div class="typing-dot" style="--delay:0.3s"></div>
            <div class="typing-dot" style="--delay:0.4s"></div>
        </div>
        </div>
         <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
    </div>
</div`;

    const outgoingChatdiv=creatElement(html, "incoming");
    chatContainer.appendChild(outgoingChatdiv);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    getChatResponse(outgoingChatdiv);

}

const handleOutgoingChat=()=>{
    userText=chatInput.value.trim();
    chatInput.value="";
    chatInput.style.height= `${initialHeight}px`; 

    const html= ` <div class="chat outgoing">
            <div class="chat-content">
                <div class="chat-details">
                   <img src="images/user.jpg" alt="user-img"> 
                    <p>${userText}</p>
                </div>
            </div>
        </div>`;
    const outgoingChatdiv=creatElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatdiv);
    document.querySelector(".default-text")?.remove();
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    setTimeout(showTypingAnimation,500);

}

themebutton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themebutton.innerText);
    themebutton.innerText = document.body.classList.contains("light-mode") 
        ? "dark_mode" 
        : "light_mode";
});
deleteButton.addEventListener("click",() =>{
    if(confirm("Are you sure you want to delete all the chats?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalstroge();
    }
});


chatInput.addEventListener("input", ()=> {
    chatInput.style.height= `${initialHeight}px`;
    chatInput.style.height= `${chatInput.scrollHeight}px`;

});
chatInput.addEventListener("keydown", (e)=> {
    if(e.key ==="Enter"&& !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleOutgoingChat();

    }
});
sendbutton.addEventListener("click",handleOutgoingChat);