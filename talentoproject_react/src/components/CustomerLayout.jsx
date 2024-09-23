import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useStateContext } from "../context/contextprovider";
import logo from "../assets/logotalentos.png";

export default function CustomerLayout() {
  const { token, setToken, setUser } = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <AppBar position="static" style={{ backgroundColor: "#f5f5f5", boxShadow: "none" }}>
        <Toolbar className="container mx-auto flex justify-between">
          <Typography variant="h6" component="div" style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ height: 50, marginRight: 10 }} />
            <span style={{ color: "#FFD700" }}>TALENTO</span> {/* Change text color here */}
          </Typography>
          <div>
            <Button color="inherit" href="/" style={{ color: "#000", marginRight: 20 }}>HOME</Button>
            <Button color="inherit" href="/customer/category" style={{ color: "#000", marginRight: 20 }}>CATEGORY</Button>
            <Button color="inherit" href="#about" style={{ color: "#000", marginRight: 20 }}>ABOUT US</Button>
            <Button color="inherit" href="/profile" style={{ color: "#000", marginRight: 20 }}>PROFILE</Button>
            <Button color="inherit" onClick={onLogout} style={{ color: "#000" }}>LOGOUT</Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between text-sm">
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold mb-2">About us</h3>
            <ul className="space-y-1">
              <li>Leadership</li>
              <li>Our Mission</li>
              <li>Our Vision</li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold mb-2">Contact us</h3>
            <p>Email: talentoorgs@gmail.com</p>
            <p>Contact #: (305) 321-7306</p>
            <p>0987654321</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Help & Support</h3>
            <ul className="space-y-1">
              <li>Customer Support</li>
              <li>Organizer Support</li>
              <li>Terms of Service</li>
              <li>Conditions of Service</li>
              <li>Privacy Policy</li>
              <li>Report a scam</li>
            </ul>
            <div className="flex space-x-2 mt-2">
              <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              <FontAwesomeIcon icon={faFacebook} className="text-xl" />
              <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
            </div>
          </div>
        </div>
        <div className="text-center mt-2 text-sm">
          © Team WORK. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
