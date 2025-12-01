import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial '
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'
import { useAppContext } from '../context/AppContext'

const Home = () => {

    const { isOwner } = useAppContext()

    return (
        <>
            <Hero />
            <RecommendedHotels />
            <FeaturedDestination />
            {!isOwner && <ExclusiveOffers />}
            <Testimonial />
            {!isOwner && <NewsLetter/>}
        </>
    )
}

export default Home