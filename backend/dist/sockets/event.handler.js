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
const connectedUsers = [];
const handleSocketEvents = (io, socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('login', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        // add current userId to connectedUser array
        if (!connectedUsers.find(u => u.userId === userId)) {
            connectedUsers.push({ userId, socketId: socket.id });
        }
        // 2. currently online users
        const users = yield Promise.all(connectedUsers.map(u => user_service_1.default.getById(u.userId)));
        // 3. send the currentUser list to all users
        io.emit("currentUsers", users);
    }));
    // client side will send 
    // 1. current userId(currUserId), 
    // 2. the other's userId(otherUserId), 
    // 3. type("dm" or "group")
    // 4. roomname - if it's a dm, it could be the other's username
    socket.on('joinRoom', (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.type === "dm") {
            const ids = [data.currUserId, data.otherUserId];
            let roomId = yield room_user_service_1.default.checkExistedRoom(ids);
            // dm's roomname - user1_user2
            const name = data.roomname;
            const type = data.type;
            // doesn't exist room -> create a new room
            if (!roomId) {
                const newRoom = yield room_service_1.default.add({ name, type });
                roomId = newRoom._id;
                // create roomUser
                yield room_user_service_1.default.add(roomId, data.currUserId);
                yield room_user_service_1.default.add(roomId, data.otherUserId);
            }
            socket.join(roomId.toString());
            socket.emit("joinedRoom", { roomId });
        }
        else {
        }
    }));
};
exports.handleSocketEvents = handleSocketEvents;
