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
const room_model_1 = require("../models/room.model");
//Get all rooms
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.find();
});
// Get room by id
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.findById(id);
});
// Get room by room name
const getByName = (roomname) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.findOne({
        name: roomname
    });
});
// Get list of rooms by the type - 'dm' or 'group'
const getTypeRooms = (type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.find({
        type
    });
});
// Add room
const add = (newRoom) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.create(newRoom);
});
//Update room by id
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.findByIdAndUpdate(id, data, {
        new: true
    });
});
//Delete room by id
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield room_model_1.Room.findByIdAndDelete(id);
});
exports.default = {
    getAll,
    getById,
    getByName,
    getTypeRooms,
    add,
    update,
    remove
};
