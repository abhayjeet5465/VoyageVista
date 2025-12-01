import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const SelectRole = () => {
  const { axios, getToken, navigate, setIsOwner, setShowHotelReg } = useAppContext();
  const [loading, setLoading] = useState(false);

  const chooseRole = async (role) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/role', { role }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        toast.success('Role updated');
        setIsOwner(role === 'hotelOwner');
        if (role === 'hotelOwner') {
          // Trigger hotel registration modal
          setShowHotelReg(true);
          navigate('/');
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to update role';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-3xl md:text-4xl font-playfair">Choose Your Portal</h1>
      <p className="text-gray-500 mt-2">Select how you want to use VoyageVista</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
        <div className="border border-gray-300 rounded-xl p-6">
          <h2 className="text-2xl font-medium">Traveler</h2>
          <p className="text-gray-500 mt-2">Search rooms, check availability, book stays, and manage your bookings.</p>
          <button disabled={loading} onClick={() => chooseRole('user')} className="mt-6 px-5 py-2 rounded bg-black text-white cursor-pointer disabled:opacity-60">Continue as Traveler</button>
        </div>
        <div className="border border-gray-300 rounded-xl p-6">
          <h2 className="text-2xl font-medium">Hotel Manager</h2>
          <p className="text-gray-500 mt-2">Register your hotel, manage rooms, and view performance dashboards.</p>
          <button disabled={loading} onClick={() => chooseRole('hotelOwner')} className="mt-6 px-5 py-2 rounded bg-indigo-600 text-white cursor-pointer disabled:opacity-60">Continue as Hotel Manager</button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
