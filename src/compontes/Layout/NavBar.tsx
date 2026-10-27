/* import React, { useContext, useState } from 'react'
import SideMenu from './SideMenu'; */
/* import {HiOutLineMenu,HiOutLineX} from 'react-icons/hi' */
/* import { HiOutlineMenu,HiOutlineX } from 'react-icons/hi';
import { LuBell } from 'react-icons/lu';
import { UserContext } from '../../context/UserContext'; */
/* const NavBar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
     const { user, clearUser } = useContext(UserContext);
  return (
    <div className=' flex h-20  justify-between items-center  p-3  bg-white border border-b border-gray-200/50  backdrop-blur-[2px] py-4 px-7 sticky top-0 '>
        <button className='block lg:hidden text-black' onClick={()=>{
            setOpenSideMenu(!setOpenSideMenu);
        }}>{openSideMenu?(<HiOutlineX className='text-2xl' />):(<HiOutlineMenu className='text-2xl'/>)}</button>
        <div className=' flex justify-between items-center'>
          
           <div>
             <div>
            <p className=" text-gray-700 flex gap-1 ">
              {" "}
              balance: <span className=" text-yellow-300"> 120USD</span>
            </p>
          </div>
           </div>
          
          <div className=" flex justify-end items-center gap-3 ">
            <div>
              <LuBell className="  text-gray-400 fill-gray-400" />
            </div>
            <div className="  ">
              <button className=" rounded-xl bg-black/30 border-gray-700 border 1 w-20 h-8 "></button>
            </div>
            <div>
              <button className=" rounded-3xl bg-black/30 min-w-50 p-1 flex justify-center items-center gap-4 ">
                <div className=" flex justify-start items-start">
                  <div className=" ">
                     <img
          src={
            user?.profileImageUrl ||
            'http://localhost:3000/uploads/default-avatar.png'
          }
          alt="Profile"
          className="w-10 h-10 bg-slate-400 rounded-full object-cover"
        />
                  </div>
                </div>
                <div className=" flex justify-end items-end flex-col">
                  <h1 className=" text-white text-[80%]">chellauser</h1>
                  <p className=" text-gray-700 text-[70%]">premium member</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      

        {openSideMenu&&(
            <div className=' fixed top-[61px]-ml-4 bg-white'>
                <SideMenu activeMenu={activeMenu}/>
            </div>
        )}
    </div>
  )
}

export default NavBar */

import React, { useContext, useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuBell, LuWallet } from "react-icons/lu";
import { UserContext } from "../../context/UserContext";

const NavBar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user } = useContext(UserContext);

  return (
    <header className="sticky top-0 z-50   min-w-0 left-0 bg-[#0b0b0b] w-[100%] text-white ">
      <div className="h-14 flex items-center justify-between  sm:px-7">

        
        <button
          className="lg:hidden text-white"
          onClick={() => setOpenSideMenu(!openSideMenu)}
          aria-label="Toggle menu"
        >
          {openSideMenu ? (
            <HiOutlineX className="text-xl" />
          ) : (
            <HiOutlineMenu className="text-xl" />
          )}
        </button>

        {/* Balance */}
        <div className="flex items-center gap-1 text-[14px]">
          <span className="text-gray-400">Balance:</span>
          <span className="text-yellow-400 font-semibold">
            {user?.balance} USD
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Notifications */}
          <button
            className="relative p-2 text-gray-400 hover:text-yellow-400"
            aria-label="Notifications"
          >
            <LuBell className="text-lg" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-400" />
          </button>

          {/* Wallet button */}
          <button
            className="hidden sm:flex items-center justify-center w-10 h-7 rounded-md bg-white/[0.03] border border-white/10 hover:border-yellow-400/40"
            aria-label="Wallet"
          >
            <LuWallet className="text-gray-400 text-sm" />
          </button>

          {/* User profile */}
          <button className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] py-1 px-2 sm:px-3">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden shrink-0">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-black font-bold text-2xl">
                  {(user?.name || "C").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start">
              <span className="text-[16px] font-semibold text-white">
                {user?.name || "ChellaUser"}
              </span>
              <span className="text-[9px] text-gray-500">
                {user?.role === "admin"
                  ? "Administrator"
                  : "Premium Member"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {openSideMenu && (
        <div className="fixed inset-y-14 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 shadow-xl lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </header>
  );
};

export default NavBar;
