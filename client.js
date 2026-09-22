const messageList = document.querySelector("#messages");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");

function addMessage(message) {
  const listItem = document.createElement("li");
  listItem.textContent = message;
  messageList.appendChild(listItem);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 화면 깜빡거리는 기본동작 막기

  const message = chatInput.value.trim(); // 앞 뒤 여백 자르기

  if (!message) return; // 메시지 빈칸이면 return

  ws.send(message); // 서버로 message 날리자
  addMessage(message);

  chatInput.value = "";
  chatInput.focus();
});
// ----------- Welcome WebSocketSever World -----------
const ws = new WebSocket(`ws://${location.host}`);

// ws.on("open", () => {});
ws.onopen = () => {
  console.log("서버 연결");
};
ws.onclose = () => {
  console.log("서버 연결 해제");
};
