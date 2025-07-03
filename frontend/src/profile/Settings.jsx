import React, { useState } from 'react';
import { toast } from "sonner";
import { updateUserDetails, updateUserPassword } from "../services/authService";
import { useEffect } from 'react';

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  });
  const token = localStorage.getItem("token");


  const [notifications, setNotifications] = useState({
    sales: true,
    newArrivals: false,
    deliveryStatus: false,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      const { name, email, phone } = form;
      const res = await updateUserDetails({ name, email, phone }, token);
      console.log("Update response:", res.data);

      if (res.data.success) {
        toast.success("Details updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update details.");
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Error updating details");
    }
  };


  const handlePasswordSave = async () => {
    if (form.newPassword !== form.repeatPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      const res = await updateUserPassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      }, token);

      if (res.data.success) {
        toast.success("Password updated successfully");
        setShowPasswordModal(false);
        setForm((prev) => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          repeatPassword: ''
        }));
      } else {
        toast.error(res.data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("Error updating password.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetails(token);
        if (res.data.success) {
          const { name, email, phone } = res.data.user;
          setForm((prev) => ({ ...prev, name, email, phone }));
        }
      } 
      catch (err) {
        toast.error("Failed to fetch user details");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2">Settings</h1>

      {/* Personal Info */}
      <div>
        <h2 className="font-semibold mb-2">Personal Information</h2>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded border"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded border"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded border"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full p-3 rounded border mb-4"
        />

        <button
          onClick={handleSaveChanges}
          className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-900"
        >
          SAVE CHANGES
        </button>
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Password</h2>
          <button
            className="text-sm text-gray-600"
            onClick={() => setShowPasswordModal(true)}
          >
            Change
          </button>
        </div>
        <input
          type="password"
          value="**********"
          disabled
          className="w-full p-3 rounded border text-gray-400"
        />
      </div>

      {/* Notifications */}
      <div>
        <h2 className="font-semibold mb-4">Notifications</h2>
        {[
          { key: 'sales', label: 'Sales' },
          { key: 'newArrivals', label: 'New arrivals' },
          { key: 'deliveryStatus', label: 'Delivery status changes' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between mb-4">
            <span>{item.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={() => handleToggle(item.key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
      </div>

      {/* Modal for password change */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-end md:items-center"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-2xl md:rounded-xl p-6 shadow-lg animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-12 bg-gray-300 mx-auto rounded mb-4" />
            <h3 className="text-center font-semibold text-lg mb-4">Password Change</h3>

            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={handleChange}
              className="w-full mb-3 p-3 rounded border"
            />
            <div className="text-right text-sm mb-2 text-blue-500 cursor-pointer">
              Forgot Password?
            </div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full mb-3 p-3 rounded border"
            />
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat New Password"
              value={form.repeatPassword}
              onChange={handleChange}
              className="w-full mb-4 p-3 rounded border"
            />
            <button
              onClick={handlePasswordSave}
              className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700"
            >
              SAVE PASSWORD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
