import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import Logo from "../assets/logotalentos.png";
import Footer from '../components/Footer';
import { useStateContext } from "../context/contextprovider"; 

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const aboutUsRef = useRef(null);
    const featuredPerformerRef = useRef(null);
    const { user } = useStateContext(); 
    const navigate = useNavigate();

    const performers = [
        { name: 'Kris Justin Oporto', role: 'Singer', location: 'Guizo, Mandaue', rating: 4.5, reviews: 16, image: 'path/to/kris-justin-oporto-image.png' },
        { name: 'John Clifford Tumulak', role: 'Dancer', location: 'Basak, Lapu-lapu', rating: 4.8, reviews: 46, image: 'path/to/john-clifford-tumulak-image.png' },
        { name: 'Niño Rey Garbo', role: 'Singer', location: 'Yati, Liloan', rating: 4.6, reviews: 35, image: 'path/to/nino-rey-garbo-image.png' },
        { name: 'Ian Jeoffrey Casul', role: 'Comedian', location: 'Unahan CCLEX, Cordova', rating: 3.0, reviews: 5, image: 'path/to/ian-jeoffrey-casul-image.png' }
    ];

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/users');
            } else if (user.role === 'customer') {
                navigate('/customer');
            } else if (user.role === 'performer') {
                navigate('/performer');
            }
        }
    }, [user, navigate]);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
                            <div className="flex items-center">
                                <img 
                                    src={Logo} 
                                    alt="Talento Logo" 
                                    className="h-10 w-auto mr-2" 
                                />
                                <h1 className="text-xl font-bold sm:text-2xl">Talento</h1>
                            </div>

                            <div className="flex items-center sm:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    type="button"
                                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="hidden sm:flex sm:ml-6">
                                <div className="flex space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Register
                                    </Link>
                                    <button
                                        onClick={() => scrollToSection(aboutUsRef)}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        About Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/login"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Register
                        </Link>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                scrollToSection(aboutUsRef);
                            }}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        >
                            About Us
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gray-100">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold sm:text-4xl text-gray-900 mb-4">Welcome to Talento</h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6">
                        Discover and book talented performers for your events. Browse through our selection of artists and find the perfect fit for your next occasion.
                    </p>
                    <Link
                        to="/register"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-lg font-semibold hover:bg-indigo-500"
                    >
                        Get Started
                    </Link>
                </div>

                <section ref={featuredPerformerRef} className="w-full bg-white py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h3 className="text-2xl font-semibold sm:text-3xl text-gray-900 mb-4">Featured Performers</h3>
                        <p className="text-base sm:text-lg text-gray-600 mb-6">
                            Meet our top performers and see why they are the best choice for your events. Browse their profiles and find the perfect talent for your occasion.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {performers.map((performer, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
                                >
                                    <img src={performer.image} alt={performer.name} className="w-full h-32 object-cover" />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">{performer.name}</h3>
                                        <p>{performer.role}</p>
                                        <p>{performer.location}</p>
                                        <p>{'★'.repeat(Math.floor(performer.rating))}{'☆'.repeat(5 - Math.floor(performer.rating))} ({performer.reviews} Reviews)</p>
                                        <button className="mt-2 p-2 bg-blue-500 text-white rounded-md">See Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section ref={aboutUsRef} className="w-full bg-gray-200 py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h3 className="text-2xl font-semibold sm:text-3xl text-gray-900 mb-4">About Us</h3>
                        <p className="text-base sm:text-lg text-gray-600 mb-6">
                            At Talent Booking, we are dedicated to connecting you with exceptional performers for your events. Our platform offers a wide range of talented artists ready to make your occasion unforgettable.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
