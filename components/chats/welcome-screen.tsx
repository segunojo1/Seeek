'use client'

import Image from 'next/image';
import { SuggestedQuestion } from './suggested-question';
import { useUserStore } from '@/store/user.store';

export function WelcomeScreen({ onSend }: { onSend: (message: string) => void }) {

      const { user } = useUserStore();
  
  const suggestedQuestions = [
    "What does niacinamide do for my skin?",
    "How much protein is in a boiled egg?",
    "Can I take paracetamol on an empty stomach?"
  ]

  return (
    <div className="flex flex-col items-center flex-grow satoshi">
      <div className='flex items-center gap-5 mb-[51px]'>
                  <Image src='/assets/user-dark.svg' alt='' width={45} height={45} className='' />
                
              <h1 className='text-[30px]/[120%] font-bold satoshi'>What are you curious about today, segun? </h1>
            </div>

      <div className='flex items-center gap-5'>
        {suggestedQuestions.map((question, index) => (
          <SuggestedQuestion
            key={index} 
            text={question}
            onClick={() => onSend(question)}
          />
        ))}
      </div>
    </div>
  )
}