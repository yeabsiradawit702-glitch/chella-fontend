import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout';
import { useUserAuth } from '../../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utilit/axiosInstance';
import { API_PATHS } from '../../../utilit/apiPath';
import InfoCard from '../../../Cards/InfoCards';
import { addThousandsSeparator } from '../../../utilit/helper';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskCard from '../../../Cards/TaskCard';

import toast from 'react-hot-toast';
import { UserContext } from '../../../context/UserContext';
export default function Tasks() {
  const [allTasks,setAllTasks]=useState([]);
  const [tabs,setTabs]=useState([])
   const [filterStatus,setFilterStatus]=useState('All')
    useUserAuth();
  const {user}=useContext(UserContext)
 
  const[dashboardData,setDashboardData]=useState();
    

    const navigate= useNavigate();
   const getAllTasks = async()=>{
      try{
      const response= await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,{
      params:{
        status:filterStatus==='All'?'':filterStatus,
      },
    });
    setAllTasks(response.data?.tasks.length>0?response.data.tasks:[])
    const statusSummary=response.data?.statusSummary||{};
    const statusArray=[
      {label:'All',count:statusSummary.all||0},
      {label:'pending',count:statusSummary.pendingTasks||0},
   /*    {label:'in progress',count:statusSummary.inprogressTasks||0}, */
      {label:'completed',count:statusSummary.completedTasks||0},
    ]
    setTabs(statusArray);
    console.log('First task:', response.data?.tasks?.[0]);
console.log('Assigned users:', response.data?.tasks?.[0]?.assignTo);
console.log('Attachments:', response.data?.tasks?.[0]?.attachemnts);
response.data?.tasks?.forEach((item) => {
  console.log('Progress:', item.progress);
  console.log('Completed:', item.completedTodoCount);
  console.log('Checklist:', item.toChecklist);
});
   }catch(error){
console.error('error',error)
   }
   };
   const handleClick=(taskId)=>{
    navigate(`/user/taskdetails/${taskId}`)
   };
  

  
  
   useEffect(()=>{
getAllTasks(filterStatus)
return ()=>{}
   },[filterStatus])
      const getDashboardData=async()=>{
        try{
          const response= await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
           console.log('Dashboard response:', response.data);
    console.log('Chart response:', response.data?.charts);
          if(response.data){
            setDashboardData(response.data);
           prepareChartData(response.data?.charts||null)
          }
        } catch (error){
          console.error('error faching user',error )
        }
      };

      useEffect(()=>{
        getDashboardData();
        return()=>{

        }
      },[])

  
  return (
    <DashboardLayout activeMenu='Tasks'>
      <div className=' my-5'>
        <div className=' flex flex-col lg:flex-col sm:flex-col lg:items-center '>
          <div className=' flex items-center justify-between gap-3'>
             <div className=' grid grid-cols-2 sm:grid-cols md:grid-cols-4 gap-3 md:gap-6 mt-5 '>
        <InfoCard
      /*   icon ={<IoMdCard/>} */
        label ='Total Tasks'
        value ={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.all ||0)}
        color='text-blue-600'/>
        <InfoCard
      /*   icon ={<IoMdCard/>} */
        label ='pending Tasks'
        value ={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.pending ||0)}
        color='  text-green-600'/>
        <InfoCard
      /*   icon ={<IoMdCard/>} */
        label ='in progress Tasks'
        value ={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.inprogress ||0)}
        color='text-red-600'/>
        <InfoCard
      /*   icon ={<IoMdCard/>} */
        label ='completed Tasks'
        value ={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.completed ||0)}
        color='text-yellow-600'/>
        </div>
          </div>
          {tabs?.[0]?.count>0 && (
            <div className='flex items-center gap-3'>
              <TaskStatuTabs 
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>
        <div className=' grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'> 
          {allTasks?.map((item) => {
  const totalTodos = item.toChecklist?.length || 0;

  const completedTodos = item.toChecklist?.filter(
    (todo) => todo.completed
  ).length || 0;

  const progress = totalTodos > 0
    ? Math.round((completedTodos / totalTodos) * 100)
    : 0;

  return (
    <TaskCard
      key={item._id}
      title={item.title}
      description={item.description}
      status={item.status}
      progress={progress}
      createdAt={item.createdAt}
      category={item.category}
      reward={item.reward}
      targetUrl={item.targetUrl}
      assignTo={item.assignedTo?.map((user) => user.profileImageUrl)}
      toChecklist={item.toChecklist || []}
      completedTodoCount={completedTodos}
      onClick={() => handleClick(item._id)}
    />
  );
})}
        </div>
      </div>
    </DashboardLayout>
  )
};
const TaskStatuTabs = ({tabs,activeTab,setActiveTab}) => {
  return (
    <div className='my-2'>
        <div className=' flex'>{tabs.map((tab)=>(
            <button key={tab.label} className={`relative px-3 md:px-4 py-2 text-sm font-medium ${activeTab===tab.label?'text-black bg-yellow-400 rounded-sm p-1':'text-gray-500 hover:text-gray-700'} cursor-pointer`} onClick={()=>setActiveTab(tab.label)}>
    <div className='flex items-center'> <span className='text-xs'>{tab.label}</span>{/* <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${activeTab===tab.label?'bg-blue-600 text-white':'bg-gray-200/70 text-gray-600'}`}>
    
    {tab.count}
    </span> */}</div>
   {/*  {activeTab===tab.label&&(
        <div className=' absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'></div>
    )} */}

            </button>

        ))}</div>
    </div>
  )
}
