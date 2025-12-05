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
const room_service_1 = __importDefault(require("../services/room.service"));
//Get all rooms
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield room_service_1.default.getAll();
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Get room by id
const getRoomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield room_service_1.default.getById(req.params.id);
        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }
        res.status(200).json(room);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Get room by room name
const getRoomByRoomName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const room = await roomService.getByName(req.query.roomname)
        // if(!room) {
        //   res.status(404).json({message: "Room not found"})
        //   return
        // }
        const rooms = yield room_service_1.default.getByKeyword(req.query.roomname);
        if (!rooms) {
            res.status(404).json({ message: "Room not found" });
            return;
        }
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// // get rooms by type
// const getRoomByTypes = async(req: Request<{},{},{type: string, userId: string}>, res: Response) => {
//   try{
//     const rooms = await room_userService.getRoomsByUser(req.body.userid, req.body.type)
//     if(!rooms){
//       res.status(500).json({message: "Rooms not found"})
//       return
//     }
//     res.status(200).json(rooms)
//   }catch (err) {
//     console.error(err)
//     res.status(500).json({ message: "Server error" })
//   }
// }
// Create room
const addRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    try {
        const newRoom = yield room_service_1.default.add({ name, type });
        if (!newRoom) {
            res.status(500).json({ message: "Unable to add Room" });
            return;
        }
        res.status(201).json(newRoom);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Update room by id
const updateRoomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    try {
        const updatedRoom = yield room_service_1.default.update(req.params.id, { name, type });
        if (!updatedRoom) {
            res.status(500).json({ message: "Unable to update room" });
            return;
        }
        res.status(200).json(updatedRoom);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Delete room by id
const deleteRoomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRoom = yield room_service_1.default.remove(req.params.id);
        if (!deletedRoom) {
            res.status(500).json({ message: "Unable to delete room" });
            return;
        }
        res.status(200).json(deletedRoom);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = {
    getAllRooms,
    getRoomById,
    getRoomByRoomName,
    addRoom,
    updateRoomById,
    deleteRoomById
};
