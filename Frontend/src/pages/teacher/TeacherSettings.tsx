import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';

const TeacherSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
        setPasswordError('');
        setPasswordSuccess('');
        const token = localStorage.getItem('token');

        // Send request to the correct endpoint
        const response = await axios.post(
            'http://localhost:8080/api/auth/change-password', 
            {
                currentPassword,
                newPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token here
                }
            }
        );

        if (response.status === 200) {
            setPasswordSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword(''); // Clear confirm password
        }
    } catch (error) {
        setPasswordError('Invalid current password or error occurred.');
        console.error('Password update error:', error);
    }
};

  const handleNotificationSave = () => {
    console.log('Notification settings saved:', { emailNotif, smsNotif });
  };

  const handleDeactivateAccount = () => {
    const confirmed = window.confirm('Are you sure you want to deactivate your account?');
    if (confirmed) {
      console.log('Account deactivated');
    }
  };

  return (
    <DashboardLayout role="ROLE_TEACHER">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>

        {/* Password Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-5 space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 border rounded"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border rounded"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-500 text-sm">{passwordSuccess}</p>
            )}
            <button
              onClick={handlePasswordUpdate}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Update Password
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow p-5 space-y-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif(!emailNotif)}
              />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={smsNotif}
                onChange={() => setSmsNotif(!smsNotif)}
              />
              <span>SMS Notifications</span>
            </label>
            <button
              onClick={handleNotificationSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save Preferences
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow p-5 space-y-4 border-t md:col-span-2">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
            <button
              onClick={handleDeactivateAccount}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSettings;
