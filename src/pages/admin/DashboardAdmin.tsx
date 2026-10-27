import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/UserContext';
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';

import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';

import moment from 'moment';
import { addThousandsSeparator } from '../../utilit/helper';
import InfoCard from '../../Cards/InfoCards';

import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../compontes/TaskListTable';
import CustomPieChart from '../../charts/CustomPieCharts';
import CustomBarChart from '../../charts/CustomBarCharts';
const COLORS =['#8D51FF','#00BBDB','#7BCE00'];


const Dashboard = () => {
  useUserAuth();
  const {user}=useContext(UserContext)
  const navigate=useNavigate();
  const[dashboardData,setDashboardData]=useState();
    const[pieChartData,setPiechartData]=useState([]);
      const[barChartData,setBarChartData]=useState([]);
      /* const prepereChartData = (data)=>{
        const  taskDistribution=data?.taskDistribution||null;
       // const taskPriorityLevels=data?.taskPriorityLevels||null;
       const taskPriorityLevels =
    data?.taskPriorityLevels ||
    data?.taskPriorityLeveles ||
    {};
        const taskDistrubutionData=[
          {status:'pending',count:taskDistribution?.pending||0},
              {status:'in progress',count:taskDistribution?.inprogress||0},
                  {status:'completed',count:taskDistribution?.completed|0}
        ];
        setPiechartData(taskDistrubutionData)
        const priorityLevelData=[
          {  priority:'low',count:taskPriorityLevels?.low||0},
              { priority:'medium',count:taskPriorityLevels?.medium||0},
                  { priority:'high',count:taskPriorityLevels?.high||0}
        ];
        setBarChartData(priorityLevelData)
      } */
     const prepareChartData = (data) => {
  const taskDistribution = data?.taskDistribution || {};

  const taskPriorityLevels =
    data?.taskPriorityLeveles || {};

  setPiechartData([
    {
      status: 'pending',
      count: taskDistribution.pending || 0,
    },
    {
      status: 'in progress',
      count: taskDistribution.inprogress || 0,
    },
    {
      status: 'completed',
      count: taskDistribution.completed || 0,
    },
  ]);

  setBarChartData([
    {
      priority: 'low',
      count: taskPriorityLevels.low || 0,
    },
    {
      priority: 'medium',
      count: taskPriorityLevels.medium || 0,
    },
    {
      priority: 'high',
      count: taskPriorityLevels.high || 0,
    },
  ]);
};
      const getDashboardData=async()=>{
        try{
          const response= await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
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
      const onSeeMore =()=>{
        navigate('/admin/tasks')
      }
      useEffect(()=>{
        getDashboardData();
        return()=>{

        }
      },[])


  return (
    <DashboardLayout activeMenu="Dashboard">  
    
    <div className=' card my-5'>
      <div>
        <div className='col-span-3'>
          <h2 className='text-xl md:text-2xl'>Welcome back! {user?.name}</h2>
          <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
            {moment().format('dddd Do MMM YYYY')}
          </p>
           
        </div>
      </div>
      <div className=' grid grid-cols-2 sm:grid-cols md:grid-cols-4 gap-3 md:gap-6 mt-5'>
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
        color='text-yellow-700'/>
        </div>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
      <div>
        <div className='card'>
          <div className=' flex  items-center justify-center'>
            <h5 className='font-medium'>Task Distubution </h5>
          </div>
          <CustomPieChart
          data={pieChartData}
          colors={COLORS}
          />
        </div>
      </div>
          <div>
     {/*    <div className='card'>
          <div className=' flex  items-center justify-between'>
            <h5 className='font-medium'>Task Priorty Level </h5>
          </div>
          <CustomBarChart
          data={barChartData}
          
          />
        </div> */}
      </div>
      <div className='md:col-span-2'>
        <div className='card'>
          <div className='flex items-center justify-between '>
            <h5 className='text-lg'> Recent Tasks</h5>
            <button className='card-btn' onClick={onSeeMore}>
              See All <LuArrowRight className='text-base'/>
            </button>

          </div>
          <TaskListTable tableData ={dashboardData?.recentTasks||[]}/>

        </div>
      </div>
    </div>
     
    </DashboardLayout>
  )
}

export default Dashboard;