import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useOutletContext } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { isSidebarOpen } = useOutletContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/users");
      if (!response || !response.data) {
        throw new Error("No data received");
      }
      setUsers(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch users");
    }
  };

  const handleEditUser = async (user) => {
    try {
      const response = await axiosClient.get(`/users/${user.id}`);
      if (response.data) {
        setEditingUser(response.data);
        setFormData({
          name: response.data.name,
          lastname: response.data.lastname,
          email: response.data.email,
          password: response.data.password || "",
          role: response.data.role,
        });
        setValidationErrors({});
        setIsModalOpen(true);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch user details");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      const response = await axiosClient.put(`/users/${editingUser.id}`, updatedData);
      if (response.data.message) {
        fetchUsers();
        setEditingUser(null);
        setIsModalOpen(false);
        toast.success("User updated successfully"); // Success toast notification
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        setError(error.message || "Failed to update user");
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axiosClient.delete(`/users/${userToDelete.id}`);
      if (response.data.message) {
        fetchUsers();
        toast.success("User deleted successfully"); // Success toast notification
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    } catch (error) {
      setError(error.message || "Failed to delete user");
      toast.error("Failed to delete user");
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      lastname: "",
      email: "",
      password: "",
      role: "",
    });
    setValidationErrors({});
  };

  return (
    <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[20rem]' : 'ml-5'}`}>
      <ToastContainer />
      <header className="bg-gray-800 shadow w-full">
        <div className="flex justify-center items-center px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            MANAGE USER ACCOUNTS
          </h1>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-300 p-4 rounded-lg shadow-sm">
                  <p className="text-lg font-semibold">{user.name} {user.lastname}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => openDeleteModal(user)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm">{validationErrors.name[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                {validationErrors.lastname && (
                  <p className="text-red-500 text-sm">{validationErrors.lastname[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm">{validationErrors.email[0]}</p>
                )}
              </div>
            
              <div className="relative">
                <label className="block text-gray-700">Password (optional)</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded pr-12" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-1 right-0 flex items-center mt-5 px-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-8 w-10 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-8 w-10 text-gray-500" />
                  )}
                </button>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">{validationErrors.password[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded">
                  <option value="performer">Performer</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
                {validationErrors.role && (
                  <p className="text-red-500 text-sm">{validationErrors.role[0]}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Update
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button 
                onClick={handleDeleteUser} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
              <button 
                onClick={closeDeleteModal} 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Update Successful</h2>
            <p>The user has been updated successfully.</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button 
                onClick={closeUpdateModal} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
