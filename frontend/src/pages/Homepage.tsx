import  {useState } from 'react'
import imgW from '../assets/welcomImg.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { useNavigate } from 'react-router-dom'
import { login, signup, validateUsername } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import type { User } from '../types/data.types'

const Homepage = () => {
    const [isSignup, setIsSignup] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [inputType, setInputType] = useState("password")
    const [error, setError] = useState("")
    const {user, setUser} = useAuth()

    const navigate = useNavigate()

    const singupHandler= async()=>{
        if(!username|| !password){
            return 
        }

        //API call - username uniqueness test
        const isUsernameExist = await validateUsername(username)
        if(isUsernameExist){
            setError("A user with that username already exist")
            return
        }

        //API call -sign in
        const res = await signup({username, password})

        if(!res){
            setError("Something went to wrong, please try again")
            return
        }

        //API call - login
        const logInUser = await login({username, password})
        console.log(logInUser)

        setUsername("")
        setPassword("")
        //Directing to chat summary page
        navigate('/chats')
    }

    const loginHandler=async()=>{
        if(!username|| !password){
            return 
        }

        //API call - login
        const userObj = await login({username, password})

        if(!userObj){
            setError("Invalid username or password")
            return
        }

        setUsername("")
        setPassword("")

        const user:User = {
            username:userObj.username,
            _id:userObj._id
        }

        console.log(user)

        //store user in AuthContext
        setUser(user)
        //Directing to chat summary page
        navigate('/chats')
    }



  return (
    <div 
    className='bg-[rgba(191,215,255,0.5)] md:bg-white h-[100vh] flex justify-center md:justify-start pt-20 md:pt-0 max-w-[1800px] mx-auto'
    id="home">
        <div className='hidden md:flex items-center justify-center md:w-[60%] bg-[#5465FF]'>
            <div className='p-9'>
                <div className='text-white logo-font text-3xl text-center pb-12'>
                    Wavechat
                </div>
                <div className='bg-[#F0F5FF] aspect-square flex items-center justify-center rounded-[50%] w-[280px] mx-auto'>
                    <img
                    src={imgW}
                    />
                </div>
                <div className='text-white text-xl p-6 text-center font-bold'>
                    Chat app for everyone
                </div>
                <div className='text-white text-center w-[80%] mx-auto'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun.
                </div>
            </div>
        </div>

        <div className='bg-white p-8 rounded-2xl h-fit w-[80%] md:w-full max-w-[480px] md:max-w-full md:h-screen flex items-center'>
            <div className='flex flex-col gap-6 max-w-[400px] w-full mx-auto'>
                <div className='logo-font pt-2 text-xl sm:text-2xl text-center md:hidden'>
                    Wavechat
                </div>
                <div className='pt-4 text-center font-bold text-[18px] sm:text-[24px]'>
                    Join & Connect with your friends
                </div>

                <div className='py-1 px-1 rounded-3xl font-bold border-2 text-[14px] sm:text-[16px] border-[#5465FF] flex justify-between w-[210px] sm:w-[280px] mx-auto'>
                    <button
                    className={`text-[#5465FF] py-2 px-7 rounded-3xl cursor-pointer ${isSignup&&'bg-[#5465FF] text-white'}`}
                    onClick={()=>setIsSignup(true)}>
                        Sign Up
                    </button>
                    <button 
                    className={`text-[#5465FF] py-2 px-7 rounded-3xl cursor-pointer ${!isSignup&&'bg-[#5465FF] text-white'}`}
                    onClick={()=>setIsSignup(false)}>
                        Log In
                    </button>
                </div>

                <div className='w-[80%] mx-auto'>
                    {/* usename Input */}
                    <div className='flex flex-col pb-2'>
                        <label className='text-[#757575] text-[13px] p-1'>
                            Username
                        </label>
                        <input type="text" name='username' id="username"
                        className='w-full border-b border-[#BDBDBD]'
                        onChange={(e)=>setUsername(e.target.value)}
                        value={username} />

                    </div>
                    <div className='flex flex-col'>
                        <label
                        className='text-[#757575] text-[13px] p-1'>Password</label>
                        <div className='flex w-full border-b border-[#BDBDBD] justify-between'>
                            <input type={inputType} name='password' id="password"
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password} />
                            {inputType==="password"?
                            <FontAwesomeIcon icon={faEye} 
                            className='pe-4 text-[#757575] cursor-pointer'
                            onClick={()=>setInputType("text")}/>:
                            <FontAwesomeIcon icon={faEyeSlash}
                            className='pe-4 text-[#757575] cursor-pointer' 
                            onClick={()=>setInputType("password")}/>
                            }
                        </div>
                    </div>
                    {error&&
                    <div className='text-sm text-red-400 pt-3'>
                        {error}
                    </div>}
                </div>

                <div className='flex justify-center pt-6'>
                    {isSignup?
                    <button 
                    className='blue-btn'
                    onClick={()=>singupHandler()}>
                        sign up
                    </button>:
                    <button 
                    className='blue-btn'
                    onClick={()=>loginHandler()}>
                        log in
                    </button>}
                </div>

                <div className='text-center pb-3 text-[14px] sm:text-[18px]'>
                {isSignup?
                <div>
                    Own an Account? 
                    <span 
                    className='uppercase underline font-bold cursor-pointer ps-2'
                    onClick={()=>setIsSignup(false)}>jump right in</span>
                </div>:
                <div>
                    Not a User?
                    <span 
                    className='uppercase underline font-bold cursor-pointer ps-2'
                    onClick={()=>setIsSignup(true)}>join the club</span>
                    </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Homepage