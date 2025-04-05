import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; // Import Header component

function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header /> {/* Add Header component */}
            <div className="flex-grow flex flex-col items-center justify-center px-4">
                {/* Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-400">Welcome to Podcaster</h1>
                    <p className="text-base md:text-lg font-medium max-w-2xl mx-auto text-gray-300">
                        Discover, explore, and listen to your favorite podcasts all in one place. Join us today and dive into a world of knowledge and entertainment.
                    </p>
                </header>

                {/* Features Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                    <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-400">Explore Top Podcasts</h3>
                        <p className="text-sm md:text-base">
                            Browse through the most popular podcasts across various genres and topics.
                        </p>
                    </div>
                    <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-400">Personalized Recommendations</h3>
                        <p className="text-sm md:text-base">
                            Get podcast suggestions tailored to your interests and preferences.
                        </p>
                    </div>
                    <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-400">Listen Anywhere</h3>
                        <p className="text-sm md:text-base">
                            Enjoy seamless listening on any device, anytime, anywhere.
                        </p>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400">Get Started Today</h2>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer Section */}
            <footer className="mt-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} Podcaster. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
