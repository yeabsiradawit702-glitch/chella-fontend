import React, { useContext } from 'react'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import { BrowserRouter as Router,Routes,Route, Outlet,Navigate } from 'react-router-dom'
import Login from './pages/admin/user/Auth/Login'
import Signup from './pages/admin/user/Auth/Signup'
import PrivateRoutes from './routes/PrivateRoutes'
import MangeTask from './pages/admin/MangeTask'
import CreateTask from './pages/admin/CreateTask'
import MangeUses from './pages/admin/ManageUser'
import DashboardUser from './pages/admin/user/DashboardUser'
import Tasks from './pages/admin/user/Tasks'
import Referrals from './pages/admin/user/Referrals'
import Transaction from './pages/admin/user/Transaction'
import Transfer from './pages/admin/user/Transfer'
import Profile from './pages/admin/user/Profile'

import UserProvider,{UserContext} from './context/UserContext'
import { Toaster } from 'react-hot-toast'
import ViewTaskDetail from './pages/admin/user/ViewTaskDetail'
export default function App() {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
            <Route element={<PrivateRoutes allowedRoles={['admin']}/>}>
                 <Route path='/admin/dashboard' element={<DashboardAdmin/>}/> 
          <Route path='/admin/tasks' element={<MangeTask/>}/> 
           <Route path='/admin/createtask' element={<CreateTask/>}/> 
            <Route path='/admin/users' element={<MangeUses/>}/> 
            </Route>
             <Route element={<PrivateRoutes allowedRoles={['admin']}/>}>
            <Route path='/user/dashboard' element={<DashboardUser/>}/> 
          <Route path='/user/tasks' element={<Tasks/>}/> 
     <Route path='/user/taskdetails/:id' element={<ViewTaskDetail/>}/> 
           <Route path='/user/referrals' element={<Referrals/>}/> 
            <Route path='/user/transaction' element={<Transaction/>}/> 
            <Route path='/user/transfer' element={<Transfer/>}/> 
            <Route path='/user/profile' element={<Profile/>}/> 
            </Route>
              <Route path='/' element={<Root/>}/>
        </Routes>
      </Router>
    </div>
    <Toaster toastOptions={{className:'', style:{fontsize:'13px'}}}/>
    </UserProvider>
  )
};
const Root =()=>{
  const {user,loading}=useContext(UserContext);
  if(loading) return <Outlet/>
  if(!user){
    return <Navigate  to='/login'/>
  }
  return user.role === 'admin'?<Navigate to='/admin/dashboard'/>:<Navigate to='/user/dashboard'/>
}

