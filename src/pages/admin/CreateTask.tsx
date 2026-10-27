import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';

import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';
import toast from 'react-hot-toast'
import { data, useLocation,useNavigate } from 'react-router-dom'
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu'
import SelectUsers from '../../compontes/inputs/SelectUser';
import TodoListInput from '../../compontes/inputs/TodoListInput';
import SelectDropdown from '../../compontes/inputs/SelectDropdown';
import Modal from '../../compontes/Modal';
import { CATAGORY_DATA } from '../../utilit/data';

import DeleteAlter from '../../compontes/DeleteAlter';

const Createtask = () => {
  const location = useLocation();
  const{taskId}=location.state||{};
  const navigate = useNavigate();
const [taskData,setTaskData]= useState({
  title:'',
  description:'',
  priority:'low',
   category:'social',
    reward:'',
    targetUrl:'',
  dueDate:null,
  assignTo:[],
  toChecklist:[],
  attachements:[],

});
const [currentTask,setCurrentTask]= useState(null);
const [error ,setError ]=useState('');
const [loading,setLoading]=useState(false)
const[openDeleteAlert,setOpenDeleteAlert]=useState(false)
const handleValueChange = (key,value)=>{
  setTaskData((prevData)=>({
    ...prevData,[key]:value
  }))
};
const clearData = ()=>{
  setTaskData({
    title:'',
   
  description:'',
  priority:'low',
   category:'social',
     reward:'',
    targetUrl:'',
  dueDate:null,
  assignTo:[],
  toChecklist :[],
  attachements:[],

  })
  }
  //create task
  const CreateTask= async ()=> {
 setLoading(true)
 try{
  const toDoList=taskData.toChecklist?.map((item)=>({
    text:item,
    completed:false,
  }));
  const response= await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{...taskData,dueDate:new Date (taskData.dueDate).toISOString(),toChecklist:toDoList })
  toast.success('Task create succefully')
  console.log(response
    
  )
  clearData();
 } catch(error){
  console.error('error',error)
  setLoading(false)
 }finally{
  setLoading(false)
 }
  };
  //update task
  const updateTask= async ()=>{
    setLoading(true);
    try{
      const todoList= taskData.toChecklist?.map((item)=>{
        const prevTodoChecklist=currentTask?.todoChecklist||[];
        const matchedTask= prevTodoChecklist.find((task)=>task.text==item);
        return {
          text:item,
          completed:matchedTask?matchedTask.completed:false,


        }
      });
      const response = await axiosInstance.put(
  API_PATHS.TASKS.UPDATE_TASK(taskId),
  {
    ...taskData,
    dueDate: undefined,
    toChecklist: todoList,
  }
);
    
  
    toast.success('Task update succesfully')
    } catch(error){
      console.error('error',error);
      setLoading(false)
    } finally{
      setLoading(false)
    } 
  };

const handleSubmit = async ()=>{
  setError(null);
  //input validation 
  if(!taskData.title.trim()){
    setError('Title is required')
    return;

  } 
  if(!taskData.description.trim()){
    setError('Description  is required')
    return;}
     /*  if(!taskData.dueDate){
    setError('Date  is required')
    return;} */
    if(!taskData.assignTo?.length===0){
      setError('Task not assign to any memeber')
      return;
    }
    if(!taskData.toChecklist?.length===0){
      setError('Add atleast on todo task')
      return;
    }
    if (
  taskData.reward === '' ||
  !Number.isFinite(Number(taskData.reward)) ||
  Number(taskData.reward) < 0
) {
  setError('Please enter a valid reward amount');
  return;
}
    if(taskId){
      updateTask()
      return;
    }
    CreateTask();
};
//get task info by id
const getTaskDetalisByID= async  ()=>{
  try{
    const response= await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
    if(response.data){
      const taskInfo= response.data;
      setCurrentTask(taskInfo);
      setTaskData((prevState)=>({
        title:taskInfo.title,
        description:taskInfo.description,
        priority:taskInfo.priority,
         category:taskInfo.category,
         reward:taskInfo.reward,
         targetUrl:taskInfo.targetUrl,
        assignTo:taskInfo?.assignedTo?.map((item)=>item?._id)||[],
        toChecklist:taskInfo?.toChecklist?.map((item)=>item?.text)||[],
        attachements:taskInfo?.attachemnts||[],
      }))
    }
  }catch(error){
    console.error('error',error)
  }
};
//delete tasks
const deleteTask=async()=>{
  try{
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
    setOpenDeleteAlert(false);
    toast.success('Expense details deleted succesfully');
    navigate('/admin/tasks')
  }catch(error){
    console.error('error',error.response?.data?.message||error.message)
  }
};

useEffect(()=>{
  if(taskId){
    getTaskDetalisByID(taskId);
  } return()=>{

  }
},[taskId])

  return (
   <DashboardLayout activeMenu='Create Task'>
   <div className='mt-5'>
    <div className=' grid grid-cols-1 md:grid-cols-4 mt-4 '>
      <div className=' from-card cols-span-3 bg-white p-2 rounded-sm  shadow-2xl'>
        <div className=' flex items-center justify-between'>
          <h2 className=' text-xl md:text-xl font-medium'>
            {taskId?'Update Task':'Create Task'}
            </h2>
            {taskId && ( 
              <button className=' flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer' onClick={()=>setOpenDeleteAlert(true)}>
                <LuTrash2 className=' text-base'/> Delete

              </button>
            )}
        </div>
        <div className='mt-4'>
          <label className='text-xs font-medium text-salte-600'>
            Task Title
          </label>
          <input placeholder='Creat APP UI'
          className='form-input'
          value={taskData.title}
          onChange={({target})=>
          handleValueChange('title',target.value)}/>
        </div>
      <div className=' mt-3'>
        <label className=' text-xs font-medium text-slate-600'>
          Description
        </label>
        <textarea placeholder=' Describe task' className='form-input' rows={4} value={taskData.description}
        onChange={({target})=>handleValueChange('description',target.value)}/>
      </div>
      <div className=' grid grid-cols-12 gap-4 mt-2 '>
        <div className='col-span-6 md:col-span-4'>
          <label className='text-xs font-medium text-slate-600 '>
            catagory
          </label>
          <SelectDropdown options={CATAGORY_DATA} value={taskData.category} onChange={(value)=>handleValueChange('category',value)} placeholder='Select catagory'/>
        </div> 
      {/*   <div className=' col-span-6 md:col-span-4 '><label className='text-xs font-medium text-slate-600'>
          Due Date 
          </label>
          <input placeholder=' create APP UI' className=' form-input'
           value={taskData.dueDate}
           onChange={({target})=>handleValueChange('dueDate',target.value)}
           type='date'
            />
          </div> */}
          <div className=' col-span-12 md:col-span-3'>
            <label className="text-xs font-medium text-slate-600">Assign To</label>
            <SelectUsers
            selectedUsers={taskData.assignTo}
            setselectedUsers={(value)=>{
              handleValueChange('assignTo',value)
            }}/>
          </div>

      </div>
      <div className='mt-3'>

        <label className="text-xs font-medium text-slate-600">Reward</label>
        <input
        type='number'
        placeholder='enter reward amount' 
        className='form-input'
        value={taskData?.reward}
          onChange={({target})=>
          handleValueChange('reward',target.value)}
        />
         
      </div>
     {['Social', 'Video'].includes(taskData.category) && (
  <div className="col-span-12 mt-3">
    <label className="text-xs font-medium text-slate-600">
      Target URL
    </label>

    <input
      type="url"
      placeholder={
        taskData.category === 'Social'
          ? 'https://instagram.com/example'
          : 'https://youtube.com/watch?v=example'
      }
      className="form-input"
      value={taskData.targetUrl}
      onChange={({ target }) =>
        handleValueChange('targetUrl', target.value)
      }
    />
  </div>
)}
      <div className='mt-3'>

        <label className="text-xs font-medium text-slate-600">To toChecklist</label>
        <TodoListInput 
        todoList={taskData?.toChecklist}
        setTodoList={(value)=>handleValueChange('toChecklist',value)}/>

      </div>
     
      {error&&(
        <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>

      )}
      <div className=' flex justify-end mt-7 '>
        <button className=' add-btn' onClick={handleSubmit} disabled={loading}>{taskId?'UPDATED TASK':'CREATE TASK'}</button>
      </div>
      </div>
    </div>
   </div>
   <Modal isOpen={openDeleteAlert} onClose={()=>setOpenDeleteAlert(false)} title='Delete Task'>
    <DeleteAlter content='Are you sure you want to delete this task ?'onDelete={()=>deleteTask()}/>
   </Modal>
   </DashboardLayout>
  )
}

export default Createtask