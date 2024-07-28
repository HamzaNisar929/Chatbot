const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const API_KEY = "AIzaSyDqEmN77s3TIw2yCd7J6ZCVMB3AQR6VtXo";
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatInputInitHeight = chatInput.scrollHeight;

let userMessage;

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = async (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector("p");
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();
    messageElement.textContent = data.candidates[0].content.parts[0].text;
    chatBox.scrollTo(0, chatBox.scrollHeight);
  } catch (err) {
    console.log(err);
    messageElement.classList.add("error");
    messageElement.textContent = "OOPs Something went wrong. Plaese try again.";
  }
  // fetch(API_URL, requestOptions)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     messageElement.textContent = data.choices[0].message.content;
  //   })
  //   .catch((err) => {
  //     messageElement.classList.add("error");
  //     messageElement.textContent =
  //       "OOPs Something went wrong. Plaese try again.";
  //   })
  //   .finally(() => {
  //     chatBox.scrollTo(0, chatBox.scrollHeight);
  //   });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  chatInput.value = "";
  if (!userMessage) return;

  chatBox.append(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.append(incomingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatBotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${chatInputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleChat();
  }
});
