import React from 'react'
import Progress from '../compontes/Progress';
import AvatarGroup from '../compontes/AvatarGroup';

import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

const TaskCard = ({title,
                  description,
                  status,
                  progress,
                  category,
                  reward,
                  targetUrl,
                  createdAt,
                  dueDate,
                  assignTo,
                  attachementCount,
                  completedTodoCount,
                  toChecklist,
                  onClick
          }) => {
            const isCompleted = status?.toLowerCase() === 'completed';

const progressColor = isCompleted ? 'bg-green-500' : 'bg-yellow-400';

            const getStatusTagColor=()=>{
                switch(status){
                    case'in progress':
                    return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
                    case 'completed':
                        return 'text-lime-500 bg-lime-50 border border-lime-500/10';
                    default :
                    return 'text-violet-500 bg-violet-50 border border-violet-500/10'; 

                }
            };
           /*  const getPriorityTagColor=()=>{
                switch(priority){
                    case 'low':
                        return'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
                          case 'medium':
                        return'text-amber-500 bg-amber-50 border border-amber-500/10';
                        default:'text-rose-500 bg-rose-50 border border-rose-500/10';
                }
            }; */
  return (
    
    <div className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer' onClick={onClick}>

        <div className='flex items-end gap-3 px-4 '>
            <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded `}>
                {status}
            </div>
           {/*  <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0 rounded `}>
                {priority} priority
            </div> */}
        </div>
        <div className={`px-4 border-l-[13px]${status==='in progress'? 'border-cyan-500':status==='completed'?'border-indigo-500':'border-violet-500'}`}> 
            <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2 '>{title}</p>
            <p className=' text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>{description}</p>
            <div className='flex gap-3 justify-center flex-col'>
                <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2 '>{category}</p>
                <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2 '>{reward}ETB</p>
                 <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2 '>{targetUrl}</p>
                
            </div>
<p className='text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]'>
  Task Done:{' '}
  <span className='font-semibold text-gray-700'>
    {completedTodoCount}/{toChecklist?.length || 0}
  </span>
</p>        </div>
<div className="mt-3">
  <div className="mb-1 flex items-center justify-between">
    <span className="text-sm text-gray-600">Progress</span>
    <span className="text-sm font-semibold">
      {progress || 0}%
    </span>
  </div>

  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
    <div
      className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
      style={{
        width: `${Math.min(100, Math.max(0, progress || 0))}%`,
      }}
    />
  </div>
</div>
        <div className='px-4'>
            <div className='flex items-center justify-between my-1'>
                <div>
                    <label className=" text-xs text-gray-500 ">Start Date </label>
                    <p className=' text-[13px] font-medium text-gray-900 '> {moment(createdAt).format('Do MMM YYYY')}</p>
                </div>
            </div>
        {/*     <label className="text-xs text-gray-500">Due Date</label>
            <p className='text-[13px] font-medium text-gray-900'>{moment(dueDate).format('Do MMM YYYY')}</p> */}
        </div>
   
    <div className='flex items-center justify-between mt-3 '>
        <AvatarGroup avatars={assignTo||[]}/>
       {/*  {attachementCount>0&&(
            <div className=' flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'><LuPaperclip className=' text-blue-600'/>{''}
            <span className='text-xs text-gray-900'>{attachementCount}</span>
            </div>
        )} */}
    </div>
     </div>
     
         
  )
}

export default TaskCard