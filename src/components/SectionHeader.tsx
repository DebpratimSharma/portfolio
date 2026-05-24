import React from 'react'
interface SectionHeaderProps{
    title?: string,
    subtitle?: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({title, subtitle}) => {
  return (
    <div className='mb-12 relative pl-6 border-l-2 border-white/10'>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {title}
        </h2>
        <p className="mt-2 text-base md:text-lg text-white/50">
            {subtitle}
        </p>
    </div>
  )
}

export default SectionHeader