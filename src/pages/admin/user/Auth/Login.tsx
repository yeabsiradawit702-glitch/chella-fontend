import React, { useContext, useState } from 'react'
import { UserContext } from '../../../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../../../utilit/helper'
import axiosInstance from '../../../../utilit/axiosInstance'
import { API_PATHS } from '../../../../utilit/apiPath'
import { Link } from 'react-router-dom'
import { LuLockKeyhole, LuUserRound } from 'react-icons/lu'
import Input from '../../../../compontes/inputs/Input'

export default function Login() {
    const [email,setEmail]=useState('')
   const [password,setPassword]=useState('')
    const [error,setError]=useState('')
    const {updateUser}=useContext(UserContext)
    const navigate = useNavigate()
    const handleLogin = async (e)=>{
      e.preventDefault();
      if(!validateEmail(email)){
        setError('please enter avalid email address');return
      }
      if(!password){
        setError('enter password'); return
      }
      setError('');
      //login api
      try{
      const response= await axiosInstance.post(API_PATHS.AUTH.LOGIN,{email,password,});
    /*   const {token,role}=response.data;
      if(token){
        localStorage.setItem('token',token);
        updateUser(response.data)
        if(role==='admin'){
          navigate('/admin/dashboard')
        }else {
          navigate('/user/dashboard')
        }
      } */
     const user = response.data;

updateUser(user);

if (user.role === "admin") {
  navigate("/admin/dashboard");
} else {
  navigate("/user/dashboard");
}
      }catch(error){
      if(error.response&&error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError('something went wrong please try again later')
      }
      }
    }
  return (
     <div className=' min-h-screen w-full  md:h-full flex flex-col justify-center items-center bg-black  gap-4'>
      <h2 className='text-yellow-300 text-2xl'>Chella</h2>
        <h3 className=' text-xl font-semibold text-white'> welcome back to your reward</h3>
       
        <form onSubmit={handleLogin} className='bg-gray-800/50 rounded-2xl w-80 p-5 flex flex-col gap-3'>
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} lable='email address' placeholder='examople@email.com'/>
           <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} lable='enter password' placeholder='Min 8 charactersitcs'/>
           {error&&<p className='text-red-500 text-xs pb-2.5'>{error}</p>}
           <button type='submit' className='btn-primary'>LOGIN</button>
           <p className=' text-blue-200 text-[13px] mt-3 flex justify-center items-center'>Dont have an account?
            <Link className='font-medium text-primary underline ' to='/signup'>SIGNUP</Link>
           </p>
        </form>
      </div>
  );
  
}
