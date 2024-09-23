import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";

export default function Messages() {
  const { isSidebarOpen } = useOutletContext();
  const { user } = useStateContext();
  const [message, setMessage] = useState("");
  const [showConversations, setShowConversations] = useState(true);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users');
        const filteredUsers = response.data.filter(u => u.role !== 'admin'); // Exclude admins
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/chats', {
            params: { user_id: selectedUser.id }
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (message.trim() !== "" && selectedUser) {
      const newMessage = { sender_id: user.id, receiver_id: selectedUser.id, message };
      setMessages([...messages, newMessage]);
      setMessage("");

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/chats', newMessage);
        setMessages([...messages, response.data]); 
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([]); 
  };

  useEffect(() => {
    const chatArea = document.getElementById("chatArea");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[20rem]' : 'ml-5'}`}>
      <header className="bg-blue-300 shadow w-full">
        <div className="flex justify-center items-center px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            CHAT
          </h1>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className={`w-64 bg-white border-r ${showConversations ? 'block' : 'hidden'} md:block`}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Active Conversations</h2>
            <input type="text" placeholder="Search..." className="w-full p-2 border rounded" />
            <ul>
              {users.map((user) => (
                <li key={user.id} onClick={() => handleUserClick(user)} className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
                  <img src={`https://i.pravatar.cc/40?img=${user.id}`} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4 flex items-center">
            <button 
              className="md:hidden mr-4 text-2xl"
              onClick={() => setShowConversations(!showConversations)}
            >
              ☰
            </button>
            <img src={`https://i.pravatar.cc/40?img=${selectedUser ? selectedUser.id : 0}`} alt={selectedUser ? selectedUser.name : "Select a user"} className="w-10 h-10 rounded-full mr-3" />
            <h2 className="text-xl font-semibold">{selectedUser ? selectedUser.name : "Select a user"}</h2>
          </div>

          <div id="chatArea" className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-2 max-w-xs ${msg.sender_id === user.id ? "bg-blue-100 ml-auto" : "bg-white"}`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          <div className="bg-white border-t p-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type something here"
                className="flex-1 p-2 border rounded-l-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded-r-lg"
                onClick={handleSendMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
