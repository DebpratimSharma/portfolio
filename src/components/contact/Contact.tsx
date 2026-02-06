import React from 'react'
import CrystalCard from '../CrystalCard'
import { PORTFOLIO_DATA } from '@/data/portfolio'
import SectionHeader from '../SectionHeader'
import RollingText from '../RollingText'
const Contact = () => {
  return (
    <section id="contact" className="max-w-340 mx-auto px-4 ">
      <SectionHeader title='Contact' subtitle='Get in touch' />
      <CrystalCard className='w-full flex flex-col p-8 '>
        <div className='header w-full  flex items-end justify-between border-b border-white/20 pb-4 mb-4'>
          <div className=''>
            <h1 className='text-4xl font-syne font-bold'>{PORTFOLIO_DATA.name}</h1>
            <h2 className='text-xl font-bold text-cyan-500/70 pt-2'>{PORTFOLIO_DATA.role}</h2>
          </div>
          <div className=''>
            
          <RollingText text={PORTFOLIO_DATA.status} className='px-4 py-2 rounded-full'/>    
          </div>
        </div>
        <div className='body w-full  flex items-end justify-between pb-4 mb-4'>
          <div className='flex flex-col gap-2 w-1/2'>
            <span className='text-3xl font-bold'>Current Status</span>
            {PORTFOLIO_DATA.statusDescription.map((status, index) => (
              <span key={index}>{status}</span>
            ))}
          </div>
          <div className='flex flex-col gap-2 w-1/2'>
            <span className='text-3xl font-bold'>Roles I'm looking for</span>
            {PORTFOLIO_DATA.roles.map((role, index) => (
              <span key={index}>{role}</span>
            ))}
          </div>
        </div>
      </CrystalCard>
    </section>

  )
}

export default Contact