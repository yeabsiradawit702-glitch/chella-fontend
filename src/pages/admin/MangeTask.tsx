import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';

import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';

import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskCard from '../../Cards/TaskCard';

import toast from 'react-hot-toast';
export default function Mangetasks() {
  const [allTasks,setAllTasks]=useState([]);
  const [tabs,setTabs]=useState([])
   const [filterStatus,setFilterStatus]=useState('All')
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
      {label:'in progress',count:statusSummary.inprogressTasks||0},
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
   const handleClick=(data)=>{
    navigate(`/admin/Createtask`,{state:{taskId:data._id}})
   }
   //download task report
   const handleDownloadReport = async()=>{
    try{
      const response= await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS,{
        responseType:'blob'
      })
      //
      const url = window.URL.createObjectURL(new Blob([response.data]))
    const Link=document.createElement('a');
    Link.href=url;
    Link.setAttribute('download','task_detials.xlsx');
    document.body.appendChild(Link);
    Link.click();
    Link.parentNode.removeChild(Link)
    window.URL.revokeObjectURL(url)
    } catch(error){
      console.error('error downloading task',error)
      toast.error('failed t download expense details. please try again later')
    }
   };
  
  
   useEffect(()=>{
getAllTasks(filterStatus)
return ()=>{}
   },[filterStatus])
  
  return (
    <DashboardLayout activeMenu='Manage Tasks'>
      <div className=' my-5'>
        <div className=' flex flex-col lg:flex-row lg:items-center justify-between'>
          <div className=' flex items-center justify-between gap-3'>
            <h2 className=' text-xl md:text-xl font-medium'>My Tasks</h2>
            <button className=' flex lg:hidden download-btn' onClick={handleDownloadReport}><LuFileSpreadsheet className=' text-lg'/> Download Report</button>
          </div>
          {tabs?.[0]?.count>0 && (
            <div className='flex items-center gap-3'>
              <TaskStatuTabs 
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
              />
              <button className='hidden lg:flex download-btn' onClick={handleDownloadReport}><LuFileSpreadsheet className=' text-lg'/>Download Report</button>
            </div>
          )}
        </div>
        <div className=' grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'> 
          {allTasks?.map((item,index)=>(
            <TaskCard key={item._id}
                  title={item.title}
                  description= {item.description}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                    category={item.category}
                    reward={item.reward}
                    targetUrl={item.targetUrl}
                  assignTo={item.assignedTo?.map((item)=>item.profileImageUrl)}
                  attachementCount={item.attachments?.length||0}
                  completedTodoCount={item.completedTodoCount||0}
                  toChecklist={item.toChecklist||[]}
                  onClick={()=>{handleClick(item)}}/>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
};
const TaskStatuTabs = ({tabs,activeTab,setActiveTab}) => {
  return (
    <div className='my-2'>
        <div className=' flex'>{tabs.map((tab)=>(
            <button key={tab.label} className={`relative px-3 md:px-4 py-2 text-sm font-medium ${activeTab===tab.label?'text-blue-600':'text-gray-500 hover:text-gray-700'} cursor-pointer`} onClick={()=>setActiveTab(tab.label)}>
    <div className='flex items-center'> <span className='text-xs'>{tab.label}</span><span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${activeTab===tab.label?'bg-blue-600 text-white':'bg-gray-200/70 text-gray-600'}`}>
    
    {tab.count}
    </span></div>
    {activeTab===tab.label&&(
        <div className=' absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'></div>
    )}

            </button>

        ))}</div>
    </div>
  )
}
