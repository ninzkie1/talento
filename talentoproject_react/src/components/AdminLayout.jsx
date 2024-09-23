import React, { useState } from "react";
import Logo from "../assets/logotalentos.png";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  BriefcaseIcon,
  ChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useStateContext } from "../context/contextprovider";

export default function AdminLayout() {
  const { user, token, setToken, setUser} = useStateContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onLogout = (ev) => {
    ev.preventDefault();
    setToken(null);
    setUser(null);
    localStorage.removeItem('USER_DATA');
  };

  const navigateToReports = () => {
    navigate("/reports");
  };

  const navigateToBookings = () => {
    navigate("/booking");
  };
  const navigateToPerformer = () => {
    navigate("/Performers");
  };

  const navigateToUsers = () => {
    navigate("/users");
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Card
        className={`h-screen w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-600 fixed transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%-2rem)]"
        }`}
      >
        {/* Toggle button */}
        <button
          className="absolute top-1/2 -right-4 bg-gray-600 p-2 rounded-r-md text-white transform -translate-y-1/2"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </button>

        <div className="flex items-center mb-2 p-3">
          <img src={Logo} alt="Talento Logo" className="h-20 w-auto mr-2" />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Welcome {user ? user.role : ""} {user ? user.name : "Guest"}!
          </h1>
        </div>
        <List>
         

          <ListItem
            className="p-3 hover:bg-gray-800"
            onClick={navigateToReports}
          >
            <ListItemPrefix>
              <ChartBarIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Reporting</Typography>
          </ListItem>

          <ListItem
            className="p-3 hover:bg-gray-800"
            onClick={navigateToBookings}
          >
            <ListItemPrefix>
              <BriefcaseIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Bookings</Typography>
          </ListItem>

          <ListItem className="p-3 hover:bg-gray-800" onClick={navigateToPerformer}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Manage Complains/Feedback</Typography>
          </ListItem>

          <ListItem className="p-3 hover:bg-gray-800" onClick={navigateToUsers}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Users</Typography>
          </ListItem>

          <ListItem onClick={onLogout} className="p-3 hover:bg-gray-800">
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Log Out</Typography>
          </ListItem>
        </List>
      </Card>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Outlet context={{ isSidebarOpen }} />
      </div>
    </div>
  );
}
