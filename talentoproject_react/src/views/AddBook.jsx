import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
export default function AddBook() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventCategory: '',
    startDate: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate('/payment');
    // Handle form submission logic here
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Event Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter the name of your event"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Event Category <span className="text-red-500">*</span></label>
            <select
              name="eventCategory"
              value={formData.eventCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Please select one</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Date & Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Start Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Where will your event take place? <span className="text-red-500">*</span></label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Please select one</option>
              <option value="location1">Location 1</option>
              <option value="location2">Location 2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
