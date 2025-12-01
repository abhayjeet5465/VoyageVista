import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth()

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchedCities, setSearchedCities] = useState([]); // max 3 recent searched cities
    // One-time portal auto-route guard per session
    // Persist hasAutoRouted in sessionStorage to prevent re-routing on page reload
    const [hasAutoRouted, setHasAutoRouted] = useState(() => {
        return sessionStorage.getItem('hasAutoRouted') === 'true';
    });
    // Hotel owner's hotels and selected hotel
    const [ownerHotels, setOwnerHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    // Loading state for user data
    const [userDataLoading, setUserDataLoading] = useState(true);

    const facilityIcons = {
        "Free WiFi": assets.freeWifiIcon,
        "Free Breakfast": assets.freeBreakfastIcon,
        "Room Service": assets.roomServiceIcon,
        "Mountain View": assets.mountainIcon,
        "Pool Access": assets.poolIcon,
    };

    const fetchUser = async () => {
        try {
            setUserDataLoading(true);
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities)
                setUserDataLoading(false);
            } else {
                // Retry Fetching User Details after 5 seconds
                // Useful when user creates account using email & password
                setTimeout(() => {
                    fetchUser();
                }, 2000);
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Failed to fetch user';
            toast.error(message)
            setUserDataLoading(false);
        }
    }

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                setRooms(data.rooms)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Failed to fetch rooms';
            toast.error(message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser();
        } else {
            setUserDataLoading(false);
        }
    }, [user]);

    // Update sessionStorage when hasAutoRouted changes
    useEffect(() => {
        sessionStorage.setItem('hasAutoRouted', hasAutoRouted.toString());
    }, [hasAutoRouted]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const value = {
        currency, navigate,
        user, getToken,
        isOwner, setIsOwner,
        axios,
        showHotelReg, setShowHotelReg,
        facilityIcons,
        rooms, setRooms,
        searchedCities, setSearchedCities,
        hasAutoRouted, setHasAutoRouted,
        ownerHotels, setOwnerHotels,
        selectedHotel, setSelectedHotel,
        userDataLoading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);