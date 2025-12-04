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
const user_service_1 = __importDefault(require("../services/user.service"));
//Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getall trigger');
    try {
        const users = yield user_service_1.default.getAll();
        if (!users) {
            res.status(500).json({ message: "Unable to find users" });
            return;
        }
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error!" });
    }
});
// get user by id
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.default.getById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Get user by username
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.default.getByUsername(req.query.username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Sign up
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (!username.trim() || !password.trim()) {
            res.status(500).json({
                message: "Missing username or password!"
            });
            return;
        }
        const newUser = yield user_service_1.default.add({ username, password });
        if (!newUser) {
            res.status(500).json({
                message: "Unable to create user"
            });
            return;
        }
        res.status(201).json(newUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (!username.trim() || !password.trim()) {
            res.status(400).json({
                message: "Id or password is empty!"
            });
            return;
        }
        const user = yield user_service_1.default.login({ username, password });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials!" });
            return;
        }
        if (req.session) {
            req.session.isLoggedIn = true;
        }
        res.status(200).json({
            message: "Login successful!",
            user
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Check auth
const checkAuth = (req, res) => {
    if (!req.session) {
        res.status(401).json({
            message: "You are not allowed to access this"
        });
    }
    else {
        res.status(200).json(req.session.isLoggedIn);
    }
};
// Logout
const logout = (req, res) => {
    if (req.session) {
        req.session = null;
    }
    res.status(200).json({
        message: "Logout successful"
    });
};
// Update user by id
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const updatedUser = yield user_service_1.default.update(req.params.id, {
            username, password
        });
        if (!updatedUser) {
            res.status(404).json({
                message: "User not found!"
            });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Delete user by id
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield user_service_1.default.remove(req.params.id);
        if (!deletedUser) {
            res.status(404).json({
                message: "User not found!"
            });
            return;
        }
        res.status(200).json(deletedUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUserById,
    deleteUser,
    login,
    logout,
    checkAuth
};
