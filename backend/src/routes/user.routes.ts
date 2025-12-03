import { Router } from "express";
import userController from "../controllers/user.controller";

//Router
const userRouter = Router()

userRouter.get('/', userController.getAllUsers)
userRouter.get('/search', userController.getUserByUsername)
userRouter.get("/:id", userController.getUserById)
userRouter.post("/", userController.addUser)
userRouter.put("/:id", userController.updateUserById)
userRouter.delete("/:id", userController.deleteUser)

export default userRouter