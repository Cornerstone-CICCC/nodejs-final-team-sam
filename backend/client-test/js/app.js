const btnJoin = document.getElementById("btn-join")
const btnLogout = document.getElementById("btn-logout")

const btnJoinRoom = document.getElementById("btn-join-room")

const btnSend = document.getElementById("send-message")

const messages = document.getElementById("messages")
const oldMessages = document.getElementById("old-messages")

const socket = io("http://localhost:3500")

btnJoin.addEventListener("click", function(){
  socket.emit("login", {
    userId: "6930d021f5d7fd00dfabf1d1"
  })
})

btnLogout.addEventListener("click", function(){
  socket.emit("logout", {
    userId: "6930d021f5d7fd00dfabf1d1"
  })
})

btnJoinRoom.addEventListener("click", function(){
  socket.emit("joinRoom", {
    currUserId: "6930d004f5d7fd00dfabf1cd",
    otherUserId: "6930d021f5d7fd00dfabf1d1",
    type: "dm",
    roomname: "john"

    // roomId: "6930d220bceca6ebb75abab1",
    // currUserId: "6930d1dfbceca6ebb75abaab"
  })
})

btnSend.addEventListener("click", () => {
  socket.emit('sendMessage', {
    roomId: "6930def35ec31820f11c5bd9",
    userId: "6930d004f5d7fd00dfabf1cd",
    content: "Test Message1 dm"
  })
})



