import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import PerformerLayout from './components/PerformerLayout';
import GuestLayout from './components/GuestLayout';
import AdminLayout from './components/AdminLayout';
import Customer from './views/Customer';
import Users from './views/Users';
import Reporting from './views/Reporting';
import Booking from './views/Booking';
import Messages from './views/Messages';
import Portfolio from './views/Portfolio';
import AddBook from './views/AddBook';
import CustomerLayout from './components/CustomerLayout';
import ManagePerformer from './views/ManagePerformer';
import HomePage from './views/HomePage'; 
import CustomerProfile from './views/CustomerProfile';
import ChatCustomer from './views/ChatCustomer';
import Payment from './views/Payment';
import Category from './views/Category';

// Assume you get the role from the user's context or state
import { useStateContext } from './context/contextprovider';

// Role-based redirect component
function RoleBasedRedirect() {
  const { user } = useStateContext(); // Assuming you have user role here

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" />;
  }

  // Redirect based on the user's role
  if (user.role === 'admin') {
    return <Navigate to="/reports" />;
  } else if (user.role === 'client') {
    return <Navigate to="/customer" />;
  } else if (user.role === 'performer') {
    return <Navigate to="/portfolio" />;
  } else {
    // If role is unknown, fallback to login
    return <Navigate to="/login" />;
  }
}

const router = createBrowserRouter([

  // Base route - handles role-based redirects
  {
    path: '/',
    element: <RoleBasedRedirect />, // Redirect based on role
  },

  // Performer routes
  {
    path: '/performer',
    element: <PerformerLayout />,
    children: [
      {
        path: 'portfolio',
        element: <Portfolio />
      },
      {
        path: 'chat',
        element: <Messages />
      },
    ]
  },

  // Customer routes
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
        path: '',
        element: <Customer />
      },
      {
        path: 'addBook',
        element: <AddBook />
      },
      {
        path:'profile',
        element: <CustomerProfile/>
      },
      {
        path:'Chats',
        element: <ChatCustomer/>
      },
      {
        path:'payment',
        element: <Payment/>
      },
      {
        path: 'category',
        element : <Category/>
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'reports',
        element: <Reporting />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'booking',
        element: <Booking />
      },
      {
        path: 'performers',
        element: <ManagePerformer />
      },
    ]
  },

  // Guest routes (Login/Register)
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
]);

export default router;
