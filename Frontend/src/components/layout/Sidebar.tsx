import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, LogOut, Award, UserCircle, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to get currentUser and setCurrentUser
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.name || ''); // Local state for full name
  const role = currentUser?.role;

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name); // Update full name whenever currentUser changes
    }
  }, [currentUser]); // Re-run when currentUser changes

  if (!currentUser) {
    navigate('/login');
    return null; // Optionally render null or a loading state here
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkClass =
    'flex gap-3 px-5 py-3 rounded-full transition-colors font-medium text-sm';
  const activeLinkClass = 'bg-white text-indigo-600 shadow-md';
  const inactiveLinkClass = 'text-white/80 hover:bg-white/10 hover:text-white';

  const renderLinks = () => {
    if (role === 'ROLE_TEACHER') {
      return (
        <>
          <NavLink
            to="/teacher/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Home size={20} />
            Dashboard
          </NavLink>
          <NavLink
            to="/teacher/courses"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <BookOpen size={20} />
            Courses
          </NavLink>
          <NavLink
            to="/teacher/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Settings size={20} />
            Settings
          </NavLink>
          <NavLink
            to="/teacher/profile"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <UserCircle size={20} />
            Profile
          </NavLink>
        </>
      );
    } else if (role === 'ROLE_STUDENT') {
      return (
        <>
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Home size={20} />
            Dashboard
          </NavLink>
          <NavLink
            to="/student/courses"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <BookOpen size={20} />
            My Courses
          </NavLink>
          <NavLink
            to="/student/grades"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Award size={20} />
            My Grades
          </NavLink>
          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <UserCircle size={20} />
            Profile
          </NavLink>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md shadow-lg focus:outline-none"
        >
          <Menu size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen overflow-hidden w-64 bg-gradient-to-b from-indigo-600 to-violet-600 p-4 flex flex-col justify-between z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transform transition-transform md:relative md:translate-x-0`}
      >
        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded"
          >
            <X size={24} />
          </button>
        )}

        <div className="flex items-center gap-3 border-b border-indigo-500/30 pb-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
            {fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-m font-semibold text-white">{fullName}</h3>
            <p className="text-sm text-indigo-200">
              {role === 'ROLE_TEACHER' ? 'Teacher' : 'Student'}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-8 px-4 py-6">{renderLinks()}</div>

        <div className="pt-4 border-t border-indigo-500/30">
          <Button
            variant="outline"
            fullWidth
            className="flex items-center justify-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
