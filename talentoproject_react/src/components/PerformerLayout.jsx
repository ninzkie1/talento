import React, { useState, useEffect } from "react";
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
  UserCircleIcon,
  InboxIcon,
  PowerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useStateContext } from "../context/contextprovider";

export default function PerformerLayout() {
  const { user, token, setToken, setUser } = useStateContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setMessage(`Welcome ${user.role} ${user.name}!`);
    } else {
      setMessage("Welcome Guest!");
    }
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onLogout = (ev) => {
    ev.preventDefault();
    setToken(null);
    setUser(null);
  };

 

  const navigateToPortfolio = () => {
    navigate("/portfolio");
  };
  const navigateToMessages = () => {
    navigate("/chat");
  };

  const navigateToBookings = () => {
    navigate("/booking");
  };

  if (!token) {
    return <Navigate to='/login' />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Card className={`h-screen w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-600 fixed transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%-2rem)]'}`}>
        {/* Toggle button */}
        <button
          className="absolute top-1/2 -right-4 bg-gray-600 p-2 rounded-r-md text-white transform -translate-y-1/2" // Updated color to grey
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
        </button>

        <div className="flex items-center mb-2 p-3">
          <img src={Logo} alt="Talento Logo" className="h-20 w-auto mr-2" /> 
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {message}
          </h1>
        </div>
        <List>
          <ListItem className="p-3 hover:bg-yellow-700" onClick={navigateToPortfolio}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Portfolio</Typography>
          </ListItem>
          <ListItem className="p-3 hover:bg-yellow-700" onClick={navigateToWallet}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Manage Wallet</Typography>
          </ListItem>
          <ListItem className="p-3 hover:bg-yellow-700" onClick={navigateToMessages}>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Messages</Typography>
          </ListItem>
          
          <ListItem className="p-3 hover:bg-yellow-700" onClick={navigateToBookings}>
            <ListItemPrefix>
              <BriefcaseIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            <Typography color="white">Bookings</Typography>
          </ListItem>
          <ListItem onClick={onLogout} className="p-3 hover:bg-yellow-700">
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
