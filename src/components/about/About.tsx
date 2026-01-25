import React from 'react'
import SectionHeader from '../SectionHeader'
import CrystalCard from '../CrystalCard'

function About() {
  return (
    <section id='about' className="max-w-340 mx-auto px-8 ">
        <SectionHeader title='About' subtitle='Designing and engineering thoughtful digital systems.' />
        <div className='w-full flex flex-col h-52 md:flex-row gap-8'>
            <CrystalCard className='w-full h-full md:w-2/3' disableSpring={true}>
            
            </CrystalCard>
            <CrystalCard className='w-full md:w-1/3'></CrystalCard>
        </div>
    </section>
  )
}

export default About