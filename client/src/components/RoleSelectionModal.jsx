import React from 'react';
import { assets } from '../assets/assets';

const RoleSelectionModal = ({ onSelectRole, onClose }) => {
  return (
    <div onClick={onClose} className="fixed top-0 bottom-0 left-0 right-0 z-[200] flex items-center justify-center bg-black/70">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl max-w-2xl w-full mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Choose Your Portal</h2>
          <img src={assets.closeIcon} alt="close" className="h-4 w-4 cursor-pointer" onClick={onClose} />
        </div>
        
        <p className="text-gray-600 mb-6">Select how you want to continue with VoyageVista</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => onSelectRole('user')}
            className="border-2 border-gray-300 hover:border-black rounded-xl p-6 text-left transition-all"
          >
            <div className="text-4xl mb-3">🧳</div>
            <h3 className="text-xl font-semibold mb-2">Traveler</h3>
            <p className="text-gray-600 text-sm">Search hotels, check availability, book rooms, and manage your reservations.</p>
          </button>
          
          <button 
            onClick={() => onSelectRole('hotelOwner')}
            className="border-2 border-indigo-300 hover:border-indigo-600 rounded-xl p-6 text-left transition-all"
          >
            <div className="text-4xl mb-3">🏨</div>
            <h3 className="text-xl font-semibold mb-2">Hotel Manager</h3>
            <p className="text-gray-600 text-sm">Register your hotel, add rooms, manage bookings, and view analytics.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
