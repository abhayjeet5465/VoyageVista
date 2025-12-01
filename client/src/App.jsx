import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'
import ListHotel from './pages/hotelOwner/ListHotel'
import HotelReg from './components/HotelReg'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import Loader from './components/Loader'
import SelectRole from './pages/SelectRole'
import About from './pages/About'
import Itinerary from "./pages/Itinerary";
import { useAuth } from "@clerk/clerk-react";


const App = () => {

  // Get current location
  const location = useLocation();
  
  // Check If Route Starts With Owner
  const isOwnerPath = location.pathname.includes("owner");

  const { showHotelReg, user, isOwner, navigate, hasAutoRouted, setHasAutoRouted, setShowHotelReg, setIsOwner, getToken, axios, userDataLoading } = useAppContext();

  // Auto-route logic 
  useEffect(() => {
    if (!user || hasAutoRouted || userDataLoading) return;
    
    const pendingRole = localStorage.getItem('pendingRole');
    
    if (pendingRole) {
      const saveRole = async () => {
        try {
          const token = await getToken();
          await axios.post('/api/user/role', { role: pendingRole }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsOwner(pendingRole === 'hotelOwner');
          localStorage.removeItem('pendingRole');
          
          if (pendingRole === 'hotelOwner') {
            setShowHotelReg(true);
            navigate('/');
          } else {
            navigate('/');
          }
          setHasAutoRouted(true);
        } catch (error) {
          console.error('Failed to save role:', error);
          localStorage.removeItem('pendingRole');
        }
      };
      saveRole();
    } else if (location.pathname === '/') {
      if (isOwner) {
        navigate('/owner');
      }
      setHasAutoRouted(true);
    }
  }, [user, isOwner, location.pathname, hasAutoRouted, userDataLoading]);

  const { isLoaded } = useAuth();

// Wait until Clerk finishes loading session
if (!isLoaded) {
  return (
    <div className="text-center py-40 text-gray-500">
      Loading session...
    </div>
  );
}

return (
  <div className='font-inter'>
    <Toaster />

    {!isOwnerPath && <Navbar />}
    {showHotelReg && <HotelReg />}

    <div className='min-h-[70vh]'>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path='/' element={<Home />} />
        <Route path='/rooms' element={<AllRooms />} />
        <Route path='/rooms/:id' element={<RoomDetails />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/about' element={<About />} />
        <Route path='/select-role' element={<SelectRole />} />
        <Route path='/loader/:nextUrl' element={<Loader />} />

        {/* AI Itinerary Route */}
        <Route path="/itinerary/:id" element={<Itinerary />} />

        {/* OWNER ROUTES */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
          <Route path="list" element={<ListHotel />} />
        </Route>

      </Routes>

    </div>

    {!isOwnerPath && <Footer />}
  </div>
);

}

export default App
