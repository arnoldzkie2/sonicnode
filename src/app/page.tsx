import Footer from '@/components/home/footer'
import Header from '@/components/home/header'
import Main from '@/components/home/main'
import Pricing from '@/components/home/pricing'
import Pterodatyl from '@/components/home/pterodactyl'
import Trial from '@/components/home/trial'
import React from 'react'

const HomePage = () => {
  return (
    <div className='px-5 sm:px-10 md:container'>
      <Header />
      <Main />
      <Pterodatyl />
      <Trial />
      <Pricing />
      <Footer />
    </div>
  )
}

export default HomePage