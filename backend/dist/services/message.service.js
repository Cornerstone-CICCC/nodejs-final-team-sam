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
const message_model_1 = require("../models/message.model");
// Get messages by roomId
const getMessages = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield message_model_1.Message.find({ roomId }).sort({ createdAt: 1 }).populate("userId", "username")
        .lean();
});
// Add message
const add = (newMessage) => __awaiter(void 0, void 0, void 0, function* () {
    return yield message_model_1.Message.create(newMessage);
});
exports.default = {
    add,
    getMessages
};
