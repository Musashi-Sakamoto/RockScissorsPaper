let messages = [];

const addMessage = ({ username, roomId, message }) => {
  username = username.trim().toLowerCase();
  roomId = roomId.trim().toLowerCase();
  message = message.trim().toLowerCase();

  const messageData = { username, roomId, message };

  messages.push(messageData);

  return { message: messageData };
}

const removeMessage = () => {
  messages = [];
}

const getMessagesInRoom = (roomId) => messages.filter((message) => message.roomId === roomId);

module.exports = { addMessage, removeMessage, getMessagesInRoom };