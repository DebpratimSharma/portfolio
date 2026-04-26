import React from 'react'
import { motion } from 'framer-motion'
interface SectionHeaderProps{
    title?: string,
    subtitle?: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({title, subtitle}) => {
  return (
    <div className='mb-12 relative pl-6 border-l-2 border-white/10'>
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
        >
            {title}
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-2 text-lg text-white/50"
        >
            {subtitle}
        </motion.p>
    </div>
  )
}

export default SectionHeader