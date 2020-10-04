const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p><strong>${item.author}: </strong>${item.message} <small>${item.ts}</small></p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  ws.send(message.value);
  message.valune = "";
};

const handleSubmitAuthor = (evt) => {
  evt.preventDefault();
  let author = document.getElementById("author").value;
  let giveAuthor = document.getElementById("give-author");
  let chat = document.getElementById("chat");
  giveAuthor.style.display = "none";
  chat.style.display = "block";
  ws.send(author);
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

const formAuthor = document.getElementById("form-author");
formAuthor.addEventListener("submit", handleSubmitAuthor);