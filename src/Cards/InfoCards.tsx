import React from 'react'

const InfoCard  = ({label,value,color}) => {
  return (
    <div className=' flex  flex-col items-center gap-4 w-40 bg-gray-900/80 h-30 rounded-2xl p-2   '> 
    
    <div />
    <p className=' text-xs md:text-[14px] text-gray-500 flex gap-1'>
        <span className=' text-sm md:text-[15px] text-white font-semibold '></span>{label}
    </p>
    <p className={` w-2 md:w-2 text-2xl font-bold h-3 md:h-5 ${color} rounded-full `}>{value}</p>

    </div>
  )
}

export default InfoCard 