/* import React, { useContext, useEffect,useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../../utils/data';

const SideMenu = ({activeMenu}) => {
    const {user,clearUser}=useContext(UserContext);
    const [sideMenuData,setSideMenuData] = useState([]);
    const navigate = useNavigate();

    const handleClick = (route)=>{
        if(route==="logout"){
            handleLogout();
            return ;
        }
        navigate(route);

    };
    const handleLogout=()=>{
        localStorage.clear();
        clearUser();
        navigate('/login');

    };
    useEffect(()=>{
        if(user){
            setSideMenuData(user?.role ==='admin'?SIDE_MENU_DATA:SIDE_MENU_USER_DATA)
        }
        return ()=>{};

    },[user])
  return <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
    <div className='flex flex-col items-center justify-center mb-7 pt-5'> 
        <div className=' relative'> 

      <img
  src={user?.profileImageUrl || "http://localhost:3000/uploads/default-avatar.pn"}
  alt="Profile image"
  className="w-20 h-20 bg-slate-400 rounded-full"
/>
    </div>
    {user?.role==='admin'&&(
        <div className=' text-[10px] font-medium text-white bg-blue-600 px-3 py-0.5  rounded mt-1'>
            Admin
            </div>
    )}
    <h5 className='text-gray-950 font-medium leading-6  mt-3'>{user?.name||''}</h5>
    <p className=' text-[12px] text-gray-500'>{user?.email||''}</p>
  </div>
  {sideMenuData.map((item,index)=>(
    <button key={`menu_${index}`} className={`w-full flex items-center gap-4 text-[15px]${activeMenu==item.lable?'text-blue-600 bg-liner-to-r from-blue-50/40 to-blue-100/50 border-r-3':""}py-3 px-6 mb-3 cursor-pointer`} onClick={()=>handleClick(item.path)}><item.icon className='text-xl'/>{item.lable}</button>
  ))}
  </div>;
};

export default SideMenu */

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

import { SIDE_MENU_DATA,SIDE_MENU_USER_DATA } from '../../utilit/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  const handleClick = (route) => {
    if (route === 'logout') {
      handleLogout();
      return;
    }

    navigate(route);
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user.role === 'admin'
          ? SIDE_MENU_DATA
          : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200/50 sticky top-[61px] z-20 p-2">
      <div className="flex flex-col items-start justify-start pr-1 mb-7 pt-5">
        {/* <img
          src={
            user?.profileImageUrl ||
            'http://localhost:3000/uploads/default-avatar.png'
          }
          alt="Profile"
          className="w-20 h-20 bg-slate-400 rounded-full object-cover"
        /> */}

        {/* {user?.role === 'admin' && (
          <div className="text-[10px] font-medium text-white bg-blue-600 px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ''}
        </h5>

        <p className="text-[12px] text-gray-500">
          {user?.email || ''}
        </p> */}
        {user?.email || ''}
        <h1 className=' text-yellow-300 text-2xl flex justify-start items-start '>Chella</h1>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer transition-colors ${
            activeMenu === item.lable
              ? 'text-black bg-yellow-300 border border-yellow-300 rounded-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <item.icon className="text-xl" />
          {item.lable}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;


