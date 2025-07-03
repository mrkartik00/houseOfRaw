import React from 'react'
import Hero from '../Components/Layout/Hero';
import GenderCollectionSelection from '../Components/Layout/Hero2';
import NewArrivals from '../Components/Products/NewArrivals';
import Customize from '../Components/Products/Customize';
import FeatureSection from '../Components/Products/FeatureSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#c9c9bf6b]">
      <Hero />
      <GenderCollectionSelection />
      <NewArrivals />

      <Customize /> 
      <FeatureSection />
    </div>
  )
}

export default Home
