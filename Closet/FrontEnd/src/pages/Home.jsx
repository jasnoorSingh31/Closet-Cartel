import React from 'react'
import MainBanner from '../components/MainBanner'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import FooterHome from '../components/FooterHome'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className='bg-nav text-white min-h-screen'>
      <div>
        <Navbar />
      </div>
      <div>
        <MainBanner />
      </div>

      <div className='mt-2'>
        <BestSeller />
      </div>

      <div className="mt-10">
        <BottomBanner />
      </div>

      <div className="mt-15">
        <FooterHome />
      </div>
    </div>
  )
}

export default Home
