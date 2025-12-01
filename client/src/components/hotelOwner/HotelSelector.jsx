import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const HotelSelector = () => {
    const { ownerHotels, setOwnerHotels, selectedHotel, setSelectedHotel, axios, getToken, user, setShowHotelReg } = useAppContext()

    // Fetch owner's hotels
    const fetchOwnerHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels/owner', { 
                headers: { Authorization: `Bearer ${await getToken()}` } 
            })
            if (data.success) {
                setOwnerHotels(data.hotels)
                // Auto-select first hotel if none selected
                if (data.hotels.length > 0 && !selectedHotel) {
                    setSelectedHotel(data.hotels[0])
                    localStorage.setItem('selectedHotelId', data.hotels[0]._id)
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Failed to fetch hotels'
            console.error('Error fetching hotels:', error)
            toast.error(message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchOwnerHotels()
        }
    }, [user])

    const handleHotelChange = (e) => {
        const hotelId = e.target.value
        const hotel = ownerHotels.find(h => h._id === hotelId)
        setSelectedHotel(hotel)
        localStorage.setItem('selectedHotelId', hotelId)
        toast.success(`Switched to ${hotel.name}`)
    }

    // Restore selected hotel from localStorage
    useEffect(() => {
        const savedHotelId = localStorage.getItem('selectedHotelId')
        if (savedHotelId && ownerHotels.length > 0) {
            const hotel = ownerHotels.find(h => h._id === savedHotelId)
            if (hotel) {
                setSelectedHotel(hotel)
            }
        }
    }, [ownerHotels])

    if (ownerHotels.length === 0) {
        return (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6'>
                <p className='text-amber-800 font-medium'>No hotels registered yet</p>
                <p className='text-amber-600 text-sm mt-1'>Please register your first hotel to start adding rooms.</p>
                <button 
                    onClick={() => setShowHotelReg(true)}
                    className='mt-3 bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700 transition-all'
                >
                    Register Hotel
                </button>
            </div>
        )
    }

    return (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between flex-wrap gap-3'>
                <div className='flex-1 min-w-64'>
                    <label className='text-gray-700 font-medium text-sm mb-2 block'>
                        Select Hotel to Manage
                    </label>
                    <select 
                        value={selectedHotel?._id || ''} 
                        onChange={handleHotelChange}
                        className='w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        {ownerHotels.map((hotel) => (
                            <option key={hotel._id} value={hotel._id}>
                                {hotel.name} - {hotel.city}
                            </option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={() => setShowHotelReg(true)}
                    className='bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-all'
                >
                    + Add New Hotel
                </button>
            </div>
            {selectedHotel && (
                <div className='mt-3 text-sm text-gray-600'>
                    <p><span className='font-medium'>Address:</span> {selectedHotel.address}</p>
                    <p><span className='font-medium'>Contact:</span> {selectedHotel.contact}</p>
                </div>
            )}
        </div>
    )
}

export default HotelSelector
