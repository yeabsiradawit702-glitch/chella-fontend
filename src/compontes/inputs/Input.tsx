import React from 'react'
import { useState } from 'react'
import { FaRegEye,FaRegEyeSlash } from 'react-icons/fa6';

const input = ({value,onChange,lable,placeholder,type}) => {
  const [showPassword,setshowPassword]=useState(false);
  const toggleShowPassword=()=>{
    setshowPassword(!showPassword);
  }
  return (
    <div>
      <div><label className='text-[13px] text-blue-200'>{lable}</label></div>
      <div className='input-box'>
        <input type={type=='password'?(showPassword?'text':'password'):type}
        placeholder={placeholder}
        className='w-full bg-transparent outline-none'
        value={value}
        onChange={(e)=>onChange(e)}
        />
        {type==='password'&&(< >{showPassword?(<FaRegEye size={22} className='text-blue-600 cursor-pointer ' onClick={()=>toggleShowPassword()} />):(<FaRegEyeSlash size={22} className='text-slate-800 cursor-pointer' onClick={()=>toggleShowPassword()} />)}</>)}
      </div>
      
    </div>
  )
}

export default input