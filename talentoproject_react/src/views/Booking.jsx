import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import prof from '../assets/logotalentos.png'

const bookings = [
  {
    name: "John Tumulak",
    date: "July 22nd, 2022 at 5:00 PM",
    location: "Starbucks",
    image: prof
  },
  {
    name: "James Gar",
    date: "July 22nd, 2022 at 5:00 PM",
    location: "Starbucks",
    image: prof
  }
];

export default function Booking() {
  const { isSidebarOpen } = useOutletContext();
  const [date, setDate] = useState(new Date());

  return (
    <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[20rem]' : 'ml-0'}`}>
      <header className="bg-gray-600 shadow w-full">
        <div className="flex justify-center items-center px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            MANAGE BOOKING
          </h1>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Upcoming Bookings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="bg-white shadow rounded-lg p-4">
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                      <img src={booking.image} alt={booking.name} className="w-12 h-12 rounded-full"/>
                      <div>
                        <h3 className="text-lg font-semibold">{booking.name}</h3>
                        <p className="text-gray-500"><i className="far fa-calendar-alt mr-1"></i>{booking.date}</p>
                        <p className="text-gray-500"><i className="fas fa-map-marker-alt mr-1"></i>{booking.location}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>There are no bookings</p>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <div className="bg-white shadow rounded-lg p-4">
                <Calendar
                  onChange={setDate}
                  value={date}
                  className="w-full"
                />
               
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
