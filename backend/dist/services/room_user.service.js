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
const room_user_model_1 = require("../models/room_user.model");
const room_model_1 = require("../models/room.model");
const mongoose_1 = __importDefault(require("mongoose"));
//Get all users by roomId
const getAll = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield room_user_model_1.RoomUser.find({ roomId }).populate("userId", "username").lean();
    return users;
});
// Get all rooms by userId
const getAllRooms = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield room_user_model_1.RoomUser.find({ userId }).populate("roomId", "name").lean();
    return rooms;
});
// Get rooms by type and userId
const getRoomsByUserAndType = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield room_user_model_1.RoomUser.find({ userId }).populate({
        path: "roomId",
        match: { type }
    }).lean();
    return rooms.filter(r => r.roomId !== null);
});
// Get roomId by userId
const checkExistedRoom = (ids, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find all room with ids
    const rooms = yield room_user_model_1.RoomUser.find({
        userId: { $in: ids }
    }).lean();
    console.log(rooms);
    // count users per roomId
    const countMap = new Map();
    rooms.forEach(r => {
        const rid = r.roomId.toString();
        countMap.set(rid, (countMap.get(rid) || 0) + 1);
    });
    // find the roomId that has two users
    const existedRoomId = (_a = [...countMap.entries()].find(([_, count]) => count === ids.length)) === null || _a === void 0 ? void 0 : _a[0];
    console.log(existedRoomId);
    if (!existedRoomId)
        return null;
    const room = yield room_model_1.Room.findOne({
        _id: existedRoomId,
        type
    }).lean();
    return room ? room._id.toString() : null;
});
//check room user exist or not
const checkRoomUser = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_user_model_1.RoomUser.find({ roomId, userId });
});
// Add room_users
const add = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_user_model_1.RoomUser.create({ roomId, userId });
});
// Delete room_users when they leave
const remove = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_user_model_1.RoomUser.deleteOne({ roomId, userId });
});
//get dm other username
const getDmRoomsWithOtherUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find all RoomUser entries for this user where room type is "dm"
    const rooms = yield room_user_model_1.RoomUser.find({ userId })
        .populate({
        path: "roomId",
        match: { type: "dm" },
    })
        .lean();
    const validRooms = rooms.filter(r => r.roomId !== null);
    // 2. For each DM room, find the other user
    const results = yield Promise.all(validRooms.map((r) => __awaiter(void 0, void 0, void 0, function* () {
        const otherUser = yield room_user_model_1.RoomUser.findOne({
            roomId: r.roomId._id,
            userId: { $ne: new mongoose_1.default.Types.ObjectId(userId) } // exclude current user
        })
            .populate({ path: "userId", select: "username" })
            .lean();
        return {
            room: r.roomId,
            otherUser: otherUser === null || otherUser === void 0 ? void 0 : otherUser.userId // { _id, username }
        };
    })));
    return results;
});
exports.default = {
    checkExistedRoom,
    checkRoomUser,
    add,
    getAll,
    remove,
    getAllRooms,
    getRoomsByUserAndType,
    getDmRoomsWithOtherUser
};
