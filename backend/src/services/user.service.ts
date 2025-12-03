import { IUser, User } from "../models/user.model";
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcrypt'
import { IUserLoginDTO } from "../types/loginDTO";

//Get all users
const getAll = async() => {
  return await User.find()
}

//Get user by id
const getById = async(id: string) => {
  return await User.findById(id)
}

//Get user by username
const getByUsername = async(username: string) => {
  return await User.findOne({
    username: {
      $regex: username,
      $options: 'i'
    }
  })
}

//Add new user
const add = async(newUser: Partial<IUser>) => {
  const {username, password} = newUser
  if(!username || !password) return false

  // check if there's already existed username
  const foundUser = await getByUsername(username)
  if(foundUser) return false

  const hashedPassword = await bcrypt.hash(password, 12)

  return await User.create({
    username,
    password: hashedPassword
  })
}

//Update user
const update = async(id: string, data: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true
  })
}

//Delete user
const remove = async(id: string) => {
  return await User.findByIdAndDelete(id)
}

// Login user
const login = async(details: IUserLoginDTO) => {
  const {username, password} = details
  const foundUser = await getByUsername(username)
  if(!foundUser) return false
  const isMatch = await bcrypt.compare(password, foundUser.password)
  if(!isMatch) return false
  return foundUser

}

export default{
  getAll,
  getById,
  getByUsername,
  add,
  update,
  remove,
  login
}