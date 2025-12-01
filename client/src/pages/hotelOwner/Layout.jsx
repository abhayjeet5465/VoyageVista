import React, { useEffect, useRef } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

    const { isOwner, navigate, userDataLoading, user } = useAppContext()
    const hasCheckedRole = useRef(false)

    useEffect(() => {
        // Only check role once after data has loaded
        if (userDataLoading || hasCheckedRole.current) return;
        
        // Mark that we've checked the role
        hasCheckedRole.current = true;
        
        // If user exists but is not an owner, redirect
        if (user && !isOwner) {
            navigate('/select-role')
        }
    }, [userDataLoading, user, isOwner, navigate])

    // Show loading while checking user role
    if (userDataLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
                    <p className='mt-4 text-gray-600'>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className='flex h-full'>
                <Sidebar />
                <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout