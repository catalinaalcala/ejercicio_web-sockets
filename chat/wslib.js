const WebSocket = require("ws");
const axios = require('axios');

let clients = [];
let messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    let name = true;
    let author = "";

    let getPromise = axios.get("http://localhost:3000/chat/api/messages");
    getPromise.then(response => response.data).then(chat => messages = chat);
    sendMessages();

    ws.on("message", (message) => {
      if (name) {
        author = message;
        name = false;
      } else {
        let newMessage = {
          message: message,
          author: author,
          ts: Date.now().toString()
        }

        axios.post("http://localhost:3000/chat/api/messages", newMessage).then(response => console.log(response));

        console.log(newMessage);
        messages.push(newMessage);
        sendMessages();
      }
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;