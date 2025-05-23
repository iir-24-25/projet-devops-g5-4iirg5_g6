import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth(); // Use setCurrentUser to update profile
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Redirect if user is not logged in
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      // Send the updated name and email to the backend
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8080/api/auth/update-profile',  // Correct endpoint to handle profile update
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPasswordSuccess('Profile updated successfully!');
        
        // Ensure the id and role are included in the updated user object
        if (currentUser) {
          const updatedUser = {
            id: currentUser.id,  // Ensure the id is taken from the currentUser
            name,
            email,
            role: currentUser.role,  // Retain the current role
            tokens: currentUser.tokens, // Include the tokens if needed
          };

          // Update the context immediately
          setCurrentUser(updatedUser);

          // Save the updated user data in localStorage to persist it
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));

          // Redirect to the dashboard with updated name
          if (currentUser.role === 'ROLE_TEACHER') {
            navigate('/teacher/dashboard');
          } else if (currentUser.role === 'ROLE_STUDENT') {
            navigate('/student/dashboard');
          }
        }
      }
    } catch (error) {
      setPasswordError('Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Prevent rendering if the user is not logged in
  }

  return (
    <DashboardLayout role={currentUser.role}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                    title="Change profile picture"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{currentUser.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
              </div>

              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
