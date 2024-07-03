import Contact from '@/components/home/contact'
import FAQ from '@/components/home/faq'
import Footer from '@/components/home/footer'
import Header from '@/components/home/header'
import Main from '@/components/home/main'
import Pricing from '@/components/home/pricing'
import Pterodatyl from '@/components/home/pterodactyl'
import db from '@/lib/db'
import React from 'react'

const HomePage = async () => {

  const eggs = await db.eggs.findMany()

  return (
    <div className='px-5 sm:px-10 md:container'>
      <Header />
      <Main />
      <div className='py-10 md:pb-20'>
        <Pricing eggs={eggs} />
      </div>
      <Pterodatyl />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  )
}

export default HomePage