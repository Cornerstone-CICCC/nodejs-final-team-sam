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
const room_user_service_1 = __importDefault(require("../services/room_user.service"));
//Get all users in the group
// id means roomId
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.id;
        const users = yield room_user_service_1.default.getAll(roomId);
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// get rooms by type
const getRoomByTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, type } = req.body;
        const rooms = yield room_user_service_1.default.getRoomsByUserAndType(userId, type);
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// get User username by type dm
const getDmRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const rooms = yield room_user_service_1.default.getDmRoomsWithOtherUser(userId);
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Create room_user
const addRoomUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, userId } = req.body;
    // Validate
    if (!roomId || !userId) {
        return res.status(400).json({ message: "roomId and userId are required" });
    }
    try {
        const newRoomUser = yield room_user_service_1.default.add(roomId, userId);
        if (!newRoomUser) {
            res.status(500).json({ message: "Unable to add Room_user" });
            return;
        }
        res.status(201).json(newRoomUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//const check if there is existing row with roomId and userId
const checkRoomUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, userId } = req.body;
    try {
        const roomUser = yield room_user_service_1.default.checkRoomUser(roomId, userId);
        res.status(201).json(roomUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = {
    getAllUsers,
    getRoomByTypes,
    addRoomUser,
    checkRoomUser,
    getDmRooms
};
