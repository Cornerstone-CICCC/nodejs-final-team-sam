import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import userService from "../services/user.service";
import mongoose from "mongoose";
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

// create user
const addUser = async(req: Request<{}, IUser>, res: Response) => {
  const {username, password} = req.body
  try{
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
  deleteUser
}