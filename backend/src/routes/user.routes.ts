import { Router } from "express";
import userController from "../controllers/user.controller";

//Router
const userRouter = Router()

userRouter.get('/', userController.getAllUsers)
userRouter.get('/search', userController.getUserByUsername)
userRouter.post("/signup", userController.addUser)
userRouter.post("/login", userController.login)
userRouter.get("/logout", userController.logout)
userRouter.get("/checkauth", userController.checkAuth)
userRouter.get("/:id", userController.getUserById)
userRouter.put("/:id", userController.updateUserById)
userRouter.delete("/:id", userController.deleteUser)

export default userRouter