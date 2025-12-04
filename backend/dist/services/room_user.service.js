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
Object.defineProperty(exports, "__esModule", { value: true });
const room_user_model_1 = require("../models/room_user.model");
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
// Get roomId by userId
const checkExistedRoom = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find all room with ids
    const rooms = yield room_user_model_1.RoomUser.find({
        userId: { $in: ids }
    });
    // count users per roomId
    const countMap = new Map();
    rooms.forEach(r => {
        const rid = r.roomId.toString();
        countMap.set(rid, (countMap.get(rid) || 0) + 1);
    });
    // find the roomId that has two users
    const existedRoomId = (_a = [...countMap.entries()].find(([_, count]) => count === ids.length)) === null || _a === void 0 ? void 0 : _a[0];
    return existedRoomId || null;
});
// Add room_users
const add = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_user_model_1.RoomUser.create({ roomId, userId });
});
// Delete room_users when they leave
const remove = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_user_model_1.RoomUser.deleteOne({ roomId, userId });
});
exports.default = {
    checkExistedRoom,
    add,
    getAll,
    remove,
    getAllRooms
};
