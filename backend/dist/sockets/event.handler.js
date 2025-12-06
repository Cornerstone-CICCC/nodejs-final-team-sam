"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketEvents = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const room_user_service_1 = __importDefault(require("../services/room_user.service"));
const room_service_1 = __importDefault(require("../services/room.service"));
const message_service_1 = __importDefault(require("../services/message.service"));
const connectedUsers = [];
const handleSocketEvents = (io, socket) => {
    console.log(`User connected: ${socket.id}`);
    // <login>
    // 1. userId
    socket.on('login', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = data.userId;
        // add current userId to connectedUser array
        if (!connectedUsers.find(u => u.userId === userId)) {
            connectedUsers.push({ userId, socketId: socket.id });
        }
        // 2. currently online users
        const users = yield Promise.all(connectedUsers.map(u => user_service_1.default.getById(u.userId)));
        // 3. send the currentUser list to all users
        io.emit("currentUsers", users);
        console.log("users list");
        console.log(users);
    }));
    // <Logout>
    // 1. userId
    socket.on('logout', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = data.userId;
        if (!connectedUsers.find(u => u.userId === userId)) {
            return;
        }
        // remove online users
        const removeIndex = connectedUsers.findIndex(u => u.userId === userId);
        if (removeIndex !== -1) {
            connectedUsers.splice(removeIndex, 1);
            const users = yield Promise.all(connectedUsers.map(u => user_service_1.default.getById(u.userId)));
            io.emit("currentUsers", users);
            console.log("updated users list");
            console.log(users);
        }
    }));
    // client side will send 
    // <DM>
    // 1. current userId(currUserId), 
    // 2. the other's userId(otherUserId), 
    // 3. type("dm")
    // 4. roomname - if it's a dm, it could be the other's username
    // <Group>
    // 1. current userId (currUserId)
    // 2. roomId (already existed)
    // 3. type("group")
    socket.on('joinRoom', (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (data.type === "dm") {
            let roomId = (_a = data.roomId) === null || _a === void 0 ? void 0 : _a.toString();
            if (!roomId) {
                const ids = [data.currUserId, data.otherUserId];
                roomId = yield room_user_service_1.default.checkExistedRoom(ids, data.type);
                console.log(roomId);
                // doesn't exist room -> create a new room
                if (!roomId) {
                    // dm's roomname - user1_user2
                    const name = data.roomname;
                    const type = data.type;
                    const newRoom = yield room_service_1.default.add({ name, type });
                    roomId = newRoom._id.toString();
                    console.log(`mewRoom: ${newRoom}`);
                    console.log("current", data.currUserId);
                    console.log("other", data.otherUserId);
                    // add users to room_users table
                    yield room_user_service_1.default.add(roomId, data.currUserId);
                    yield room_user_service_1.default.add(roomId, data.otherUserId);
                }
            }
            // join the room
            socket.join(roomId.toString());
            // load the history message
            const oldMessages = yield message_service_1.default.getMessages(roomId);
            // send the old message to specific user
            socket.emit("oldMessages", oldMessages);
            console.log(oldMessages);
            socket.emit("joinedRoom", { roomId });
            console.log(`roomId: ${roomId}`);
        }
        else {
            const roomId = data.roomId;
            const userId = data.currUserId;
            const username = (_b = (yield user_service_1.default.getById(userId))) === null || _b === void 0 ? void 0 : _b.username;
            // add user to room_users table 
            // ->remove this cuz room_users table need to be add when the group is created
            //since we are not joining group chat right after creating group
            //await room_userService.add(roomId, userId)
            //join the room
            socket.join(roomId.toString());
            socket.emit("joinedRoom", { roomId });
            console.log(`group roomId: ${roomId}`);
            // load the history message
            const oldMessages = yield message_service_1.default.getMessages(roomId);
            // send the old message to specific user
            socket.emit("oldMessages", oldMessages);
            console.log(oldMessages);
            // send a message to all clients in the room 
            socket.broadcast.to(roomId.toString()).emit('systemChat', {
                username: "System",
                message: `${username} has joined`
            });
        }
    }));
    //Send message
    // 1. roomId
    // 2. userId
    // 3. content
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const { roomId, userId, content } = data;
        try {
            // save message to messages table
            const message = yield message_service_1.default.add({ roomId, userId, content });
            // broadcast the message to users in the roon
            io.to(roomId.toString()).emit("newMessage", message);
            console.log(`newMessage: ${message}`);
        }
        catch (err) {
            console.error('Error saving message:', err);
        }
    }));
    //Leave room
    // 1. roomId
    socket.on("leaveRoom", (data) => {
        const roomId = data.roomId;
        socket.leave(roomId.toString());
    });
    //Delete room
    // 1. roomId
    // 2. userId
    socket.on("deleteRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const roomId = data.roomId;
        const userId = data.userId;
        const username = (_a = (yield user_service_1.default.getById(userId))) === null || _a === void 0 ? void 0 : _a.username;
        // leave the room
        socket.leave(roomId.toString());
        // delete the user from the group
        const res = yield room_user_service_1.default.remove(roomId, userId);
        // get updatedRoomList
        const roomList = yield room_user_service_1.default.getAllRooms(userId);
        //notify 
        socket.broadcast.to(roomId.toString()).emit('systemChat', {
            username: "System",
            message: `${username} has left`
        });
        socket.emit("updatedRoomList", roomList);
    }));
    //distconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
};
exports.handleSocketEvents = handleSocketEvents;
