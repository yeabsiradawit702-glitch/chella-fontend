import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout'
import { LuCircleCheck, LuFlashlight, LuLightbulb, LuMoveRight, LuUsers, LuWallet } from 'react-icons/lu'
import axiosInstance from '../../../utilit/axiosInstance'
import { API_PATHS } from '../../../utilit/apiPath'

export default function DashboardUser() {
    type item ={
   id:number,
    title:string,
    date:string,
    price:string
  }
  type user={
    name:string,
    email:string
  }
  type dashboardDatatype={
    balance:number,
    pendingTasks:number,
    recentTransactions:string,
    tasksCompleted:string,
    tasksToday:string,
    totalEarned:string,
    totalReferrals:string,
    user:user

  }
  
    const [dashboardData,setdashboardData]=useState<dashboardDatatype>()
    const[loading,setloading]=useState(false)
    const[error,seterror]=useState("")
     
 
    const fetchdashboardData =async()=>{
        setloading(true)
        try{
             const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA1);

            setdashboardData(response.data)
        }catch(error){
          seterror("error ")  
        }finally{
              setloading(false)
        }
    }
       useEffect(()=>{
        fetchdashboardData()
    },[])
     const [viewall, setviewall] = useState(false);
 
if(loading)return
<h1>loading</h1>
if(error)return
<h1>error</h1>
  return (
    <DashboardLayout activeMenu="Dashboard">
             
        <div className=" grid gap-5   ">
          <h1 className=" text-[200%] text-white  ">Welcome back,{dashboardData?.user.name}</h1>
          <div className=" flex justify-center items-center gap-3 max-md:grid max-md:grid-cols-1 max-sm:grid max-sm:grid-cols-1">
            <div className=" flex justify-between rounded-2xl  bg-amber-300/30 w-50  p-5 gap-3">
              <div>
                <p className=" text-yellow-300/75">Total balance</p>
                <h1 className="text-yellow-300 font-bold text-3xl">{dashboardData?.balance}ETB</h1>
                <p className=" text-gray-700">Avialiable for withdrawl</p>
              </div>
              <div>
                <LuWallet className=" bg-amber-300/20 rounded-sm p-2 fill-amber-300 w-8 h-8" />
              </div>
            </div>
            <div className=" flex justify-between rounded-2xl   bg-green-700/30 w-50 p-5 gap-3">
              <div>
                <p className=" text-green-300/75">Total earned</p>
                <h1 className="text-green-600 font-bold text-3xl">{dashboardData?.totalEarned}ETB</h1>
                <p className=" text-green-700">Avialiable for withdrawl</p>
              </div>
              <div>
                <LuLightbulb className=" bg-green-500/20 rounded-sm p-2 fill-green-500 w-8 h-8" />
              </div>
            </div>{" "}
            <div className=" flex justify-between rounded-2xl  bg-blue-500/30  w-50  p-5 gap-3">
              <div>
                <p className=" text-blue-300/75">Tasks Today</p>
                <h1 className="text-blue-700 font-bold text-3xl">{dashboardData?.tasksToday}ETB</h1>
                <p className=" text-blue-700">Avialiable for withdrawl</p>
              </div>
              <div>
                <LuCircleCheck className=" bg-blue-300/20 rounded-sm p-2 fill-blue-300 w-8 h-8 text-blue-900" />
              </div>
            </div>
            <div className=" flex justify-between rounded-2xl  bg-purple-700/30  w-50  p-5 gap-3">
              <div>
                <p className=" text-purple-300/75">Total Referrals</p>
                <h1 className="text-purple-700 font-bold text-3xl">{dashboardData?.totalReferrals}</h1>
                <p className=" text-purple-700">Avialiable for withdrawl</p>
              </div>
              <div>
                <LuUsers className=" bg-purple-300/20 rounded-sm p-2 fill-purple-300 w-8 h-8 text-purple-800" />
              </div>
            </div>
          </div>
          <div className=" flex justify-center items-center gap-3 p-0 max-md:grid max-md:grid-cols-1 max-sm:grid max-sm:grid-cols-1">
            <div className=" flex flex-col gap-1 justify-start items-start bg-gray-900/30 p-4 w-90 rounded-2xl">
              <LuFlashlight className=" bg-yellow-300/15 text-yellow-300 rounded-sm p-2 size-10" />
              <h1 className=" text-white text-2xl font-bold">Complete Tasks</h1>
              <p className=" text-gray-700">{dashboardData?.pendingTasks} Pending tasks</p>
              <p className=" text-yellow-300 flex gap-1  ">
                Earn now <LuMoveRight />
              </p>
            </div>
            <div className=" flex flex-col gap-1 justify-start items-start bg-gray-900/30 p-4 w-90 rounded-2xl">
              <LuUsers className=" bg-yellow-300/15 text-yellow-300 rounded-sm p-2 size-10" />
              <h1 className=" text-white text-2xl font-bold">Refere Friends</h1>
              <p className=" text-gray-700">Earn 20 ETB per Friends</p>
              <p className=" text-yellow-300 flex gap-1  ">
                Share code <LuMoveRight />
              </p>
            </div>
            <div className=" flex flex-col gap-1 justify-start items-start bg-gray-900/30 p-4 w-90 rounded-2xl">
              <LuFlashlight className=" bg-yellow-300/15 text-yellow-300 rounded-sm p-2 size-10" />
              <h1 className=" text-white text-2xl font-bold">
                Transfer Balance
              </h1>
              <p className=" text-gray-700">send to other users</p>
              <p className=" text-yellow-300 flex gap-1  ">
                Transfer <LuMoveRight />
              </p>
            </div>
          </div>
        
        <div className="grid gap-3 bg-gray-900/30 p-4 rounded-sm min-h-20 w-[80%]">
          <div className=" flex justify-between">
            <div>
              <h1 className=" text-white  font-bold">Recent Transactions{dashboardData?.recentTransactions}</h1>
            </div>
            <div>
              <p className=" text-yellow-300">
                <button onClick={() => setviewall(!viewall)}>view all</button>
              </p>
            </div>
          </div>
         
        </div>
        </div>
    </DashboardLayout>
  )
}
