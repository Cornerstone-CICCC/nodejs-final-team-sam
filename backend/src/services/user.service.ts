import { IUser, User } from "../models/user.model";

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
  return await User.create(newUser)
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

export default{
  getAll,
  getById,
  getByUsername,
  add,
  update,
  remove
}