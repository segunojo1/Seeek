import { ChevronRight } from 'lucide-react'
import React from 'react'

const Calendar = () => {
  return (
    <div className='w-[342px] h-[245px] bg-[#F0F0EF] dark:bg-[#404040] rounded-[6px] flex pl-[15px] pr-[35px] pb-[15px] flex-col items-start justify-end gap-[10px]'>
        <h2 className='text-[#737373] dark:text-[#FAFAFA] text-[18px] font-bold satoshi'>Stay on track with reminders and automatic logging via  <span>Routines.</span></h2>
        <p className='text-[14px] text-[#525252] dark:text-[#D4D4D4]'>Plan your meals, medication, skincare, and other health habits — all with time-based reminders.</p>
        <div className='flex items-center gap-2'>

        <p className='text-[14px] text-[#F9E8CD] dark:text-[#F9E8CD]'>Create your Routine</p><ChevronRight className='text-[#F9E8CD]' width={14} height={18} />
        </div>
    </div>
  )
}

export default Calendar