import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useOutletContext } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Portfolio() {
  const { isSidebarOpen } = useOutletContext();
  const { user, setUser } = useStateContext();
  const [performer, setPerformer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    theme_name: '',
    talent_name: '',
    location: '',
    description: '',
    rate: '',
    profile_image: null
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const eventNames = ["Birthday", "Party", "Wedding", "Gigs"];
  const themeNames = ["Rock", "80's", "Retro Party", "Romance"];

  useEffect(() => {
    if (user && user.id) {
      axiosClient.get(`/performer/${user.id}`)
        .then(response => {
          const { portfolio, user } = response.data;
          setPerformer(response.data);
          setFormData({
            event_name: portfolio?.event_name || '',
            theme_name: portfolio?.theme_name || '',
            talent_name: portfolio?.talent_name || '',
            location: portfolio?.location || '',
            description: portfolio?.description || '',
            rate: portfolio?.rate || '',
            profile_image: null
          });
        })
        .catch(error => {
          setError(error.message || "Error fetching performer profile");
          console.error("Error fetching performer profile:", error);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFormData({ ...formData, profile_image: acceptedFiles[0] });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      console.error("User ID is missing");
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    axiosClient.post(`/performer/${user.id}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        const { user: updatedUser, portfolio } = response.data;
        setUser(updatedUser);
        setPerformer(response.data);
        setFormData({
          event_name: portfolio?.event_name || '',
          theme_name: portfolio?.theme_name || '',
          talent_name: portfolio?.talent_name || '',
          location: portfolio?.location || '',
          description: portfolio?.description || '',
          rate: portfolio?.rate || '',
          profile_image: null
        });
        setEditing(false);
        toast.success("Performer portfolio updated successfully");
      })
      .catch(error => {
        if (error.response && error.response.data.errors) {
          setValidationErrors(error.response.data.errors);
        } else {
          setError(error.message || "Error updating performer portfolio");
          toast.error("Error updating performer portfolio");
        }
      });
  };

  if (!performer) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[20rem]' : 'ml-5'}`}>
      <ToastContainer />
      <header className="bg-gray-800 shadow w-full">
        <div className="flex justify-center items-center px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {user ? `${user.name}'s Portfolio` : ''}
          </h1>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            <img 
              src={user?.image_profile ? `http://127.0.0.1:8000/storage/${user.image_profile}` : "https://via.placeholder.com/150"} 
              alt={user?.name} 
              className="w-32 h-32 rounded-full"
            />
            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{user?.name || "User Name"}</h3>
                <p className="mt-1 text-sm text-gray-500">{user?.profession || "Profession"} • {user?.location || "Location"}</p>
                <div className="mt-2 flex space-x-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">4.9/5 (26 reviews)</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button 
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-md">Post Photo/Video</button>
              </div>
            </div>
          </div>
          {editing && (
            <div className="mt-8">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                    <select
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Select an event</option>
                      {eventNames.map(event => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Theme Name</label>
                    <select
                      name="theme_name"
                      value={formData.theme_name}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Select a theme</option>
                      {themeNames.map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Talent Name</label>
                    <input
                      type="text"
                      name="talent_name"
                      value={formData.talent_name}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate</label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4">
                      <input {...getInputProps()} />
                      {formData.profile_image ? (
                        <p>{formData.profile_image.name}</p>
                      ) : (
                        <p>Drag 'n' drop a file here, or click to select one</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          {!editing && (
            <div className="mt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Description</h3>
              <p className="mt-1 text-sm text-gray-500">{performer.portfolio.description || ''}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
