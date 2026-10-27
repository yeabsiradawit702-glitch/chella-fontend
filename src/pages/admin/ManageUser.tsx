import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';

import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../Cards/UserCard';

import toast from 'react-hot-toast';
const Manageuser = () => {
  const [allUsers,setAllUsers]=useState([]);
  const getAllUsers= async()=>{
    try{
      const response= await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if(response.data?.length>0){
        setAllUsers(response.data)
      } 
    }catch(error){
        console.error('error',error)
      }
    }
      useEffect(()=>{
        getAllUsers();
        return ()=>{

        }
      },[])
  // download task report 
  const handelDownloadTReport=async()=>{
   try{
    const response= await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS,{
      responseType:'blob'
    });
    //create a URL for blob
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const Link=document.createElement('a');
    Link.href=url;
    Link.setAttribute('download','user._detials.xlsx');
    document.body.appendChild(Link);
    Link.click();
    Link.parentNode.removeChild(Link)
    window.URL.revokeObjectURL(url)
   } catch(error){
    console.error('error when downloading',error);
    toast.error('Faild to download.please try again')
   }
  }
  
  
  return (
      <DashboardLayout activeMenu='Team Members'>
        <div className='mt-5 mb-10'>
          <div className='flex md:flex-row md:items-center justify-between'>
            <h2 className=' text-xl md:text-xl font-medium'>Team Memebers</h2>
            <button className='flex md:flex download-btn ' onClick={handelDownloadTReport}> <LuFileSpreadsheet className='text-lg'/>Download Report </button>
          </div>
          <div className=' grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
            {allUsers?.map((user)=>(
              <UserCard  key={user._id} userInfo={user}/>
            ))}
          </div>
        </div>
      </DashboardLayout>
  )
}

export default Manageuser