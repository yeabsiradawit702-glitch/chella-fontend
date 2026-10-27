 import React from 'react'

const Progress = ({progress,status}) => {
    
 const getColor=()=>{
    switch(status){
        case'in progress':
                    return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
                    case'completed':
                        return 'text-green-500 bg-green-50 border border-green-500/10';
                    default :
                    return 'text-violet-500 bg-violet-50 border border-violet-500/10'; 
    }
 };
 return(
    <div className=' w-full bg-gray-200 rounded-full h-1.5 '>
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium `} style={{width:`${progress}%`}}>
            
        </div>
    </div>
 )
}

export default Progress 





