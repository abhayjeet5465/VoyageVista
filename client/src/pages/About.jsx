import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const About = () => {
    const navigate = useNavigate()
    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title="About VoyageVista" subTitle="Your trusted partner for seamless hotel bookings and unforgettable travel experiences." />
            
            <div className='max-w-4xl mx-auto mt-12 space-y-8'>
                <section className='bg-white rounded-xl shadow-lg p-8'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Our Mission</h2>
                    <p className='text-gray-600 leading-relaxed'>
                        At VoyageVista, we're dedicated to making hotel bookings simple, transparent, and enjoyable. 
                        We connect travelers with exceptional accommodations worldwide, ensuring every journey is memorable.
                    </p>
                </section>

                <section className='bg-white rounded-xl shadow-lg p-8'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>What We Offer</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='space-y-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1'>
                                    <span className='text-white text-sm'>✓</span>
                                </div>
                                <div>
                                    <h3 className='font-medium text-gray-800'>Wide Selection</h3>
                                    <p className='text-sm text-gray-600'>Thousands of verified hotels across the globe</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1'>
                                    <span className='text-white text-sm'>✓</span>
                                </div>
                                <div>
                                    <h3 className='font-medium text-gray-800'>Best Prices</h3>
                                    <p className='text-sm text-gray-600'>Competitive rates with exclusive deals</p>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1'>
                                    <span className='text-white text-sm'>✓</span>
                                </div>
                                <div>
                                    <h3 className='font-medium text-gray-800'>Secure Booking</h3>
                                    <p className='text-sm text-gray-600'>Safe and encrypted payment processing</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1'>
                                    <span className='text-white text-sm'>✓</span>
                                </div>
                                <div>
                                    <h3 className='font-medium text-gray-800'>24/7 Support</h3>
                                    <p className='text-sm text-gray-600'>Customer service always available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='bg-white rounded-xl shadow-lg p-8'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>For Hotel Owners</h2>
                    <p className='text-gray-600 leading-relaxed mb-4'>
                        Partner with VoyageVista to reach millions of travelers worldwide. Our platform offers:
                    </p>
                    <ul className='space-y-2 text-gray-600'>
                        <li className='flex items-center gap-2'>
                            <span className='text-blue-600'>→</span> Easy hotel and room management
                        </li>
                        <li className='flex items-center gap-2'>
                            <span className='text-blue-600'>→</span> Real-time booking and revenue tracking
                        </li>
                        <li className='flex items-center gap-2'>
                            <span className='text-blue-600'>→</span> Secure payment processing
                        </li>
                        <li className='flex items-center gap-2'>
                            <span className='text-blue-600'>→</span> Analytics and insights dashboard
                        </li>
                    </ul>
                </section>

                <section className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white'>
                    <h2 className='text-2xl font-semibold mb-4'>Get Started Today</h2>
                    <p className='mb-6 opacity-90'>
                        Whether you're looking to book your next stay or list your property, VoyageVista is here to help.
                    </p>
                    <div className='flex flex-wrap gap-4'>
                        <button 
                            onClick={() => navigate('/rooms')}
                            className='bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all'
                        >
                            Browse Hotels
                        </button>
                        <button 
                            onClick={() => alert('Contact feature coming soon!')}
                            className='bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all'
                        >
                            Contact Us
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default About
