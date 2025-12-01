import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'

const ListHotel = () => {
    const { axios, getToken, user, ownerHotels, setOwnerHotels, selectedHotel, setSelectedHotel, setShowHotelReg, navigate } = useAppContext()

    // Fetch owner's hotels
    const fetchOwnerHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels/owner', { 
                headers: { Authorization: `Bearer ${await getToken()}` } 
            })
            if (data.success) {
                setOwnerHotels(data.hotels)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Failed to fetch hotels'
            toast.error(message)
        }
    }

    const handleSelectHotel = (hotel) => {
        setSelectedHotel(hotel)
        localStorage.setItem('selectedHotelId', hotel._id)
        toast.success(`Selected ${hotel.name}`)
    }

    useEffect(() => {
        if (user) {
            fetchOwnerHotels()
        }
    }, [user])

    return (
        <div>
            <Title align='left' font='outfit' title='My Hotels' subTitle='Manage all your registered hotels and their details. Switch between hotels to view and manage their rooms and bookings.' />
            
            <div className='flex items-center justify-between mt-8 mb-4'>
                <p className='text-gray-500'>Total Hotels: {ownerHotels.length}</p>
                <button 
                    onClick={() => setShowHotelReg(true)}
                    className='bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2'
                >
                    <span className='text-xl'>+</span>
                    Add New Hotel
                </button>
            </div>

            {ownerHotels.length === 0 ? (
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mt-6'>
                    <p className='text-gray-600 text-lg mb-2'>No hotels registered yet</p>
                    <p className='text-gray-500 text-sm mb-4'>Start by registering your first hotel to manage rooms and bookings</p>
                    <button 
                        onClick={() => setShowHotelReg(true)}
                        className='bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all'
                    >
                        Register Your First Hotel
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                    {ownerHotels.map((hotel) => (
                        <div 
                            key={hotel._id}
                            className={`border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
                                selectedHotel?._id === hotel._id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                            }`}
                            onClick={() => handleSelectHotel(hotel)}
                        >
                            <div className='flex items-start justify-between mb-4'>
                                <div className='flex-1'>
                                    <h3 className='text-xl font-semibold text-gray-800 mb-1'>{hotel.name}</h3>
                                    <div className='flex items-center text-sm text-gray-600 mt-2'>
                                        <img src={assets.locationIcon} alt="location" className='w-4 h-4 mr-1' />
                                        <span>{hotel.city}</span>
                                    </div>
                                </div>
                                {selectedHotel?._id === hotel._id && (
                                    <div className='bg-blue-600 text-white text-xs px-3 py-1 rounded-full'>
                                        Selected
                                    </div>
                                )}
                            </div>

                            <div className='space-y-2 text-sm text-gray-600 mb-4'>
                                <p><span className='font-medium'>Address:</span> {hotel.address}</p>
                                <p><span className='font-medium'>Contact:</span> {hotel.contact}</p>
                                <p className='text-xs text-gray-500'>
                                    Registered: {new Date(hotel.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className='flex gap-2 pt-4 border-t border-gray-200'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectHotel(hotel);
                                        navigate('/owner/add-room');
                                    }}
                                    className='flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-all'
                                >
                                    Add Room
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectHotel(hotel);
                                        navigate('/owner/list-room');
                                    }}
                                    className='flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-all'
                                >
                                    View Rooms
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ListHotel
