/* /* import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import NavBar from './NavBar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ children,activeMenu}) => {
    const {user}= useContext(UserContext)
  return (
    
    <div className=' flex '>
       
        {user&&(
            <div className=' flex '>
                <div className='max-[1080px]:hidden'>
                    <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className='grow mx-5'>{ children}</div>
            </div>
        )}
            <div>   <NavBar activeMenu={activeMenu}/></div>
      
    </div>
  )
}

export default DashboardLayout */

import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import NavBar from './NavBar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen max-w-full p-0 m-0 ">
      {user && (
        <div className="flex min-h-screen">
      
          <aside className="hidden min-[1081px]:block w-60 shrink-0">
            <SideMenu activeMenu={activeMenu} />
          </aside>

          
          <div className="flex min-w-0 flex-1 flex-col px-4 pr-0">
            <NavBar activeMenu={activeMenu} />

            <main className="flex-1 px-5 py-5">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout; 



 