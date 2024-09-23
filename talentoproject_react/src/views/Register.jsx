import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/contextprovider";
import Footer from "../components/Footer";

export default function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const lastnameRef = useRef();
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    const { setUser, setToken } = useStateContext();
    const navigate = useNavigate();

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current.value,
            lastname: lastnameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            role: role,
        };
        if (!role) {
            setError('Role is required.');
            return;
        }

        axiosClient.post("/register", payload)
        .then(({ data }) => {
            setUser(data.user);
            setToken(data.token);

            if (data.user.role === 'admin') {
                navigate('/users');
            } else if (data.user.role === 'client') {
                navigate('/customer');
            } else if (data.user.role === 'performer') {
                navigate('/portfolio');
            }
        })
        .catch(err => {
            const response = err.response;
            if (response) {
                setError(`Error: ${response.data.message}`);
            } else {
                setError(`Error: ${err.message}`);
            }
        });
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    ref={nameRef}
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    ref={lastnameRef}
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Create Password
                            </label>
                            <input
                                ref={passwordRef}
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 rounded ${role === 'client' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                                onClick={() => setRole('client')}
                            >
                                Client
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 rounded ${role === 'performer' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                                onClick={() => setRole('performer')}
                            >
                                Performer
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I accept to the <Link to="/terms" className="underline">Terms & Conditions</Link>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500"
                        >
                            Create account
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="underline text-indigo-600 hover:text-indigo-500">
                            Log in now
                        </Link>
                    </p>
                </div>
               
            </div>
            <Footer/>
        </>
    );
}
