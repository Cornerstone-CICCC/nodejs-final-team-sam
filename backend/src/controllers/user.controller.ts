import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import userService from "../services/user.service";
import { IUserLoginDTO } from "../types/loginDTO";


//Get all users
const getAllUsers = async(req: Request, res: Response) => {
  console.log('getall trigger')
  try{
    const users = await userService.getAll();

    if(!users) {
      res.status(500).json({message: "Unable to find users"})
      return
    }

    res.status(200).json(users)
  }catch(err){
    console.error(err)
    res.status(500).json({ message:"Server error!" })
  }
}

// get user by id
const getUserById = async(req: Request<{id: string}>, res: Response) => {
  try{
    
    const user = await userService.getById(req.params.id)
    if(!user){
      res.status(404).json({ message: "User not found!" })
      return
    }
    res.status(200).json(user)
  }catch(err){
    console.error(err)
    res.status(500).json({message: "Server error"})
  }
}

//Get user by username
const getUserByUsername = async(req: Request<{}, {}, {}, {username: string}>, res: Response) =>{
  try{
    const user = await userService.getByUsername(req.query.username)
    if(!user){
      res.status(404).json({message: "User not found"})
      return
    }
    res.status(200).json(user)
  }catch(err){
    console.error(err)
    res.status(500).json({message: "Server error"})
  }
}

// Sign up
const addUser = async(req: Request<{}, IUser>, res: Response) => {
  const {username, password} = req.body

  try{

    if(!username.trim() || !password.trim()){
      res.status(500).json({
        message: "Missing username or password!"
      })
      return
    }

    const newUser = await userService.add({username,password})
    if(!newUser){
      res.status(500).json({
        message: "Unable to create user"
      })
      return
    }
    res.status(201).json(newUser)
  }catch(err){
    console.error(err)
    res.status(500).json({message: "Server error"})
  }
}

// Login
const login = async (req: Request<{}, {}, IUserLoginDTO>, res:Response) => {
  const {username, password} = req.body
  try{
    if (!username.trim() || !password.trim()) {
      res.status(400).json({
        message: "Id or password is empty!"
      })
      return
    }

    const user = await userService.login({username, password})
    if(!user){
      res.status(401).json({message:"Invalid credentials!"})
      return
    }
    
    if(req.session){
      req.session.isLoggedIn = true
    }

    res.status(200).json({
      message: "Login successful!",
      user
    })

  }catch(err){
    console.error(err)
    res.status(500).json({message: "Server error"})
  }

}

//Check auth
const checkAuth = (req: Request, res: Response) => {
  if(!req.session){
    res.status(401).json({
      message: "You are not allowed to access this"
    })
  }else{
    res.status(200).json(req.session.isLoggedIn)
  }
  
}

// Logout
const logout = (req: Request, res: Response) => {
  if(req.session) {
    req.session = null
  }
  res.status(200).json({
    message: "Logout successful"
  })
}

// Update user by id
const updateUserById = async(req: Request<{id: string}, Partial<IUser>>, res: Response) => {
  const {username, password} = req.body
  try{
    const updatedUser = await userService.update(req.params.id, {
      username, password
    })
    if(!updatedUser) {
      res.status(404).json({
        message: "User not found!"
      })
      return
    }
    res.status(200).json(updatedUser)

  }catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

//Delete user by id
const deleteUser = async(req: Request<{id: string}>, res:Response ) => {
  try{
    const deletedUser = await userService.remove(req.params.id)
    if(!deletedUser) {
      res.status(404).json({
        message: "User not found!"
      })
      return
    }
    res.status(200).json(deletedUser)
  }catch(err){
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}


export default{
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUserById,
  deleteUser,
  login,
  logout,
  checkAuth
}