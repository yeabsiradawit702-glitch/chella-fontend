import React, { useContext, useState } from 'react'
import { UserContext } from '../../../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../../../utilit/helper'
import axiosInstance from '../../../../utilit/axiosInstance'
import { API_PATHS } from '../../../../utilit/apiPath'
import { Link } from 'react-router-dom'
import { LuLockKeyhole, LuUserRound } from 'react-icons/lu'
import Input from '../../../../compontes/inputs/Input'
import ProfilePhotoSelector from '../../../../compontes/inputs/ProfilePhotoSelector'
import uploadImage from '../../../../utilit/uploads'

export default function Signup() {
   const [profilepPic,setprofilePic]=useState(null)
  const [fullName,setfullName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [adminInviteToken,setAdminInviteToken]=useState('')
    const [error,setError]=useState(null)
    const {updateUser}=useContext(UserContext)
    const navigate=useNavigate();
      const handleSignup = async (e)=>{
          e.preventDefault();
          let profileImageUrl=''
          if(!fullName){
            setError('enter full name');return
          }
          if(!validateEmail(email)){

          if(!password){
            setError('enter password'); return
          }
          setError('');

        }
          try{
            //upload image
        if(profilepPic){
          const imgUploadRes= await uploadImage(profilepPic);
          profileImageUrl=imgUploadRes.imageUrl||'';
        }
      const response= await axiosInstance.post(API_PATHS.AUTH.REGISTER,{name:fullName, email,password  ,profileImageUrl,adminInviteToken});
    
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
   <div className='min-h-screen w-full  md:h-full flex flex-col justify-center items-center bg-black  gap-4'>
     <h3 className='text-xl font-semibold text-yellow-300'>create an account</h3>

     <form onSubmit={handleSignup}  className='bg-gray-800/50 rounded-2xl w-80 p-5 flex flex-col gap-3'>
      
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
        <ProfilePhotoSelector image={profilepPic} setImage={setprofilePic}/>
      <Input  value={fullName}
      onChange={({target})=>setfullName(target.value)}
      lable='Full Name'
      placeholder='john'
      type='text'
      />
       
      <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} lable='email address' placeholder='examople@email.com'/>
           <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} lable='enter password' placeholder='Min 8 charactersitcs'/>
            <Input type="text " value={adminInviteToken} onChange={(e)=>setAdminInviteToken(e.target.value)} lable='Admin Invite Token' placeholder='6 digit code'/> </div>
             {error&&<p className='text-red-500 text-xs pb-2.5'>{error}</p>}
           <button type='submit' className='btn-primary'>SIGN UP</button>
           <p className=' text-blue-200 text-[13px] mt-3'>Already have an account?
            <Link className='font-medium text-primary underline ' to='/login'>LOGIN
            </Link>
           </p>
     


     </form>
      </div>
  );
  
}
