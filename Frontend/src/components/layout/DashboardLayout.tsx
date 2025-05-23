import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getUserFromToken } from '../../contexts/AuthContext'; // adjust path if needed

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const user = getUserFromToken(); // or useContext if you're using AuthContext
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== role) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 font-semibold text-xl">
        Unauthorized: You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar/>
      <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
