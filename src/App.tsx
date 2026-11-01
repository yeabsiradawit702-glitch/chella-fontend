
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardAdmin from './pages/admin/DashboardAdmin';
import Login from './pages/admin/user/Auth/Login';
import Signup from './pages/admin/user/Auth/Signup';
import PrivateRoutes from './routes/PrivateRoutes';

import MangeTask from './pages/admin/MangeTask';
import CreateTask from './pages/admin/CreateTask';
import MangeUses from './pages/admin/ManageUser';

import DashboardUser from './pages/admin/user/DashboardUser';
import Tasks from './pages/admin/user/Tasks';
import Referrals from './pages/admin/user/Referrals';
import Transaction from './pages/admin/user/Transaction';
import Transfer from './pages/admin/user/Transfer';
import Profile from './pages/admin/user/Profile';
import ExchangePage from './pages/admin/user/ExchangePage';
import ViewTaskDetail from './pages/admin/user/ViewTaskDetail';

import NotificationTest from './pages/NotificationTest';
import PrivacySecurity from './pages/setting/PrivacySecurity';
import LandingPage from './pages/LandingPage';

import UserProvider from './context/UserContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin routes */}
          <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/tasks" element={<MangeTask />} />
            <Route path="/admin/createtask" element={<CreateTask />} />
            <Route path="/admin/users" element={<MangeUses />} />
          </Route>

          {/* Member routes */}
          <Route element={<PrivateRoutes allowedRoles={['member']} />}>
            <Route path="/user/dashboard" element={<DashboardUser />} />
            <Route path="/user/tasks" element={<Tasks />} />
            <Route path="/user/taskdetails/:id" element={<ViewTaskDetail />} />
            <Route path="/user/referrals" element={<Referrals />} />
            <Route path="/user/transaction" element={<Transaction />} />
            <Route path="/user/transfer" element={<Transfer />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/notifications-test" element={<NotificationTest />} />
            <Route path="/user/exchange" element={<ExchangePage />} />
            <Route path="/privacy-security" element={<PrivacySecurity />} />
          </Route>

        </Routes>

        <Toaster toastOptions={{ className: '', style: { fontSize: '13px' } }} />
      </Router>
    </UserProvider>
  );
}
