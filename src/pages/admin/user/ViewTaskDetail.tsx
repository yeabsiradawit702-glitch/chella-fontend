import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utilit/axiosInstance';
import { API_PATHS } from '../../../utilit/apiPath';
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout';
import moment from 'moment';
import AvatarGroup from '../../../compontes/AvatarGroup';
import YouTubeReward from '../../../Cards/YouTubeReward';

import { LuSquareArrowOutUpRight } from 'react-icons/lu';
export default function ViewTaskDetail() {
  const {id}=useParams();
  const [task,setTask]= useState(null);
  const getStatusTagColor=(status)=>{
    switch(status){
      case'in progress':
      return'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case'completed':
      return'text-green-500 bg-green-50 border border-green-500/10';
      default : 
      return 'text-violet-500 bg-violet-50 border border-violet-500/10';

    }
  };
 const getTaskDetailsByID=async()=>{
 try{
  const response=await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
  if(response.data){
    const taskInfo=response.data;
    setTask(taskInfo)
  }
 } catch(error){
  console.error('error feaching user',error)
 }
 }
 
 /* const updateTodoChecklist=async(index)=>{
  const toCheckList=[...task ?.toChecklist];
  const taskId=id;
  if(toCheckList&&toCheckList[index]){
    toCheckList[index].completed=!toCheckList[index].completed;
    try{
      const response=await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),{toCheckList});
      if(response.status===200){
        setTask(response.data?.task||task);
      }else{
        toCheckList[index].completed=!toCheckList[index].completed;
      }
    }catch(error){
      toCheckList[index].completed=!toCheckList[index].completed;
    }
  }
 } */
const updateTodoChecklist = async (index) => {
  if (!task?.toChecklist?.[index]) return;

  const updatedChecklist = task.toChecklist.map((item, i) =>
    i === index
      ? { ...item, completed: !item.completed }
      : item
  );

  // Update the UI immediately
  const previousTask = task;

  setTask({
    ...task,
    toChecklist: updatedChecklist,
  });

  try {
    const response = await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
      { toChecklist: updatedChecklist }
    );

    // Support either response format
    const updatedTask = response.data?.task ?? response.data;

    if (updatedTask?.toChecklist) {
      setTask(updatedTask);
    }
  } catch (error) {
    // Restore the previous state if saving fails
    setTask(previousTask);

    console.error(
      "Error updating checklist:",
      error.response?.data || error.message
    );
  }
};
const handleLinkClick=(Link)=>{
  if(!/^https?:\/\//i.test(Link)){
    Link='https://'+Link;
  }
  window.open(Link,'_blank');
};
useEffect(()=>{
  if(id){
    getTaskDetailsByID()
  } return()=>{}
},[id]);
  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className=' mt-5  '>
       {task &&( <div className='grid grid-cols-1 md:grid-cols-4 mt-4  '>
          <div className=' form-card col-span-3 '>
            <div className=' flex items-center justify-between  '>
              <h2 className='text-sm md:text-xl font-medium'>{task?.title}</h2>
              <div className={`text-[11px] md:text-[13px]  font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded`}>
               {task?.status}
              </div>
            </div>
            <div className=' mt-4'>
              <InfoBox label='Description' value={task?.description}/>
            </div>
            <div className=' grid grid-cols-12 gap-4 mt-4 '>
              <div className='col-span-6 md:col-span-4 '>
              <InfoBox label='category' value={task?.category}/>
              </div>
               <div className='col-span-6 md:col-span-4 '>
              <InfoBox label='Reward' value={task?.reward}/>
              </div>
              <div className='col-span-6 md:col-span-4'>
                <InfoBox label='Due Date' value={task?.dueDate?moment(task?.dueDate).format('Do MMM YYYY'):'N/A'}/>
              </div>
              <div className='col-span-6 md:col-span-4'>
                <label className="text-xs font-medium text-slate-500 ">
                  Assisgn To
                </label>
                <AvatarGroup avatars={task?.assignedTo?.map((item)=>item?.profileImageUrl)||[]} maxVisible={5}/>
              </div>
            </div>
         <div className='mt-2 '>
          <label className="text-xs font-medium text-slate-500">
            Todo Checklist
          </label>
          {task?.toChecklist?.map((item,index)=>(
            <TodoCheckList key={`todo_${index}`} text={item.text} isChecked={item?.completed} onChange={()=>updateTodoChecklist(index)}/>
          ))}
         </div>
         {task?.category === 'Video' && task?.targetUrl && (
  <YouTubeReward
    taskId={task._id}
    targetUrl={task.targetUrl}
  />
)}
      {task?.targetUrl && (
  <div className="mt-2">
    <label className="text-xs font-medium text-slate-500">
      Target URL
    </label>

    <p
      className="text-sm text-blue-600 cursor-pointer break-all"
      onClick={() => handleLinkClick(task.targetUrl)}
    >
      {task.targetUrl}
    </p>
  </div>
)}
          </div>
        </div>)}
      </div>
    </DashboardLayout>
  )
}
const InfoBox=({label,value})=>{
 return <>
 <label className="text-xs font-medium text-slate-500 ">{label}</label>
 <p className='text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5'>{value}</p>
 </>
};
const TodoCheckList=({text,isChecked,onChange})=>{
  return <div className='flex items-center gap-3 p-3 '>
    <input type="checkbox" checked={isChecked} onChange={onChange} className=' w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer'/>
    <p className='text-[13px] text-gray-800 '>{text}</p>
  </div>
};
const TargetUrl=({Link,index,onClick})=>{
  return <div className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer'  onClick={onClick}>
    <div className=' flex-1 flex items-center gap-3'> <span className='text-xs text-gray-400 font-semibold mr-2 '>{index<9?`0${index + 1}`:index+1}</span>
    <p className='text-xs text-black '>{Link}</p>
    </div>
    <LuSquareArrowOutUpRight className='text-gray-400'/>
   
    
  </div>
}