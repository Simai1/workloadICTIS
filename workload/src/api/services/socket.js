import socketIO from "socket.io-client";

function socketConnect() {
  const socketUrl = process.env.REACT_APP_API_URL;
  const socket = socketIO.connect(socketUrl);

  return new Promise((resolve) => {
    socket.on("connect", (data) => {
      console.log("Получен ответ от сервера:", data);
    });

    socket.on("notificationCreated", (data) => {
      console.log("notificationCreated", data);
      resolve(data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
}

export default socketConnect;
