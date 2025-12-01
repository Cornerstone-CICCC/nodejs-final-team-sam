"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Create server
const app = (0, express_1.default)();
//Middleware
app.use(express_1.default.json());
//Routes
app.get("/", (req, res) => {
    res.status(200).send("Server is running");
});
//Fallback/404
app.use((req, res, next) => {
    res.status(404).send("Invalid route");
});
//start server
const PORT = process.env.PORT;
const CONN_STRING = process.env.DATABASE_URI;
if (!PORT || !CONN_STRING) {
    throw new Error("Missing port or connecting string!");
}
// to see if you can connect to Mongoose
mongoose_1.default
    .connect(CONN_STRING, { dbName: "wavechat" })
    .then(() => {
    console.log('connected to MongoDB!');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error(err);
    throw err;
});
