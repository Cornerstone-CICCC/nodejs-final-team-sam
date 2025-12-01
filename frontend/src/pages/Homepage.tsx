import React, { use, useState } from 'react'

const Homepage = () => {
    const [isSignup, setIsSignup] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
  return (
    <div 
    className='bg-[rgba(191,215,255,0.5)] md:bg-white h-[100vh] flex justify-center md:justify-start pt-20 md:pt-0 max-w-[1800px] mx-auto'
    id="home">
        <div className='md:w-[55%] bg-[#5465FF]'>
        </div>

        <div className='bg-white p-8 rounded-2xl h-fit w-[80%] md:w-full max-w-[480px] md:max-w-full md:h-screen flex items-center'>
            <div className='flex flex-col gap-6 max-w-[400px] mx-auto'>
                <div className='pt-5 text-center font-bold text-[24px]'>
                    Join & Connect with your friends
                </div>

                <div className='py-1 px-1 rounded-3xl font-bold border-2 text-[16px] border-[#5465FF] flex justify-between w-[280px] mx-auto'>
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
                    <div className='flex flex-col'>
                        <label className='text-[#757575] text-[13px] p-2'>
                            Username
                        </label>
                        <input type="text" name='username' id="username"
                        className='w-full'
                        onChange={(e)=>setUsername(e.target.value)}
                        value={username} />
                        {/* Error message come here */}
                    </div>
                    <div className='flex flex-col'>
                        <label
                        className='text-[#757575] text-[13px] p-2'>Password</label>
                        <div className='flex w-full'>
                            <input type="password" name='password' id="password"
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password} />
                        </div>
                        {/* Error message come here */}
                    </div>
                </div>

                <div className='flex justify-center pt-6'>
                    <button className='uppercase font-bold bg-[#788BFF] py-3 px-6 rounded-3xl text-white'>
                        {isSignup?'sign up':'log in'}
                    </button>
                </div>

                <div className='text-center'>
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