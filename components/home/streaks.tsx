'use client';

import { Flame } from 'lucide-react';
import { useEffect } from 'react';
import { useStreaksStore } from '@/store/streaks.store';

interface StreakBoxProps {
  active: boolean;
}

const StreakBox = ({ active }: StreakBoxProps) => (
  <div 
    className={`w-[26px] h-[26px] rounded-[7.6px] shadow-md ${
      active ? 'bg-[#F9E8CD]' : 'bg-[#F5F5F5] dark:bg-[#262626]'
    }`} 
  />
);

const Streaks = () => {
  const { streakCount, fetchStreakCount, isLoading } = useStreaksStore();
  const totalDays = 30;
  
  // Create an array of 30 days
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  useEffect(() => {
    fetchStreakCount();
  }, [fetchStreakCount]);

  return (
    <section className="max-w-[342px] w-full">
      <div className='flex flex-col justify-between gap-4 h-[245px] p-[14px] bg-[#F0F0EF] dark:bg-[#404040] rounded-[6px]'>
        <div className='flex flex-wrap gap-1'>
          {days.map((day) => (
            <StreakBox 
              key={day} 
              active={day <= streakCount}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className='text-[18px] text-[#737373] dark:text-[#D4D4D4] font-bold satoshi'>
              {isLoading ? 'Loading...' : `${streakCount} day${streakCount !== 1 ? 's' : ''} streak`}
            </p>
            <p className='text-[14px] text-[#F9E8CD] dark:text-[#F9E8CD]'>View Full Stats</p>
          </div>
          <div className="p-2 rounded-full bg-[#FEE2E2] dark:bg-[#3D1A1A] text-[#EF4444]">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Streaks;