import React from 'react';
import Header from '../components/Header';

function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">About Podcaster</h1>
                <p className="text-lg text-center mb-12 text-gray-300">
                    Podcaster is your one-stop platform for discovering, exploring, and listening to the best podcasts from around the world.
                </p>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-xl font-bold mb-2 text-blue-400">Discover New Podcasts</h3>
                        <p className="text-sm text-gray-300">
                            Explore a wide range of podcasts across various genres, including technology, education, entertainment, and more.
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-xl font-bold mb-2 text-blue-400">Personalized Experience</h3>
                        <p className="text-sm text-gray-300">
                            Get recommendations tailored to your interests and preferences, ensuring you never miss out on great content.
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-xl font-bold mb-2 text-blue-400">Seamless Listening</h3>
                        <p className="text-sm text-gray-300">
                            Enjoy a smooth and uninterrupted listening experience on any device, anytime, anywhere.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">Our Mission</h2>
                    <p className="text-sm text-gray-300">
                        At Podcaster, our mission is to connect people with the stories, knowledge, and entertainment they love. We believe in the power of podcasts to inspire, educate, and entertain, and we strive to make them accessible to everyone.
                    </p>
                </section>

                {/* Team Section */}
                <section className="bg-gray-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">Meet the Team</h2>
                    <p className="text-sm text-gray-300 mb-4">
                        Podcaster is built by a passionate team of developers, designers, and podcast enthusiasts who are dedicated to creating the best podcasting experience for our users.
                    </p>
                    <ul className="list-disc list-inside text-gray-300">
                        <li>Vishal - Co-Founder</li>
                        <li>Digvijay - Co-founder</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;
