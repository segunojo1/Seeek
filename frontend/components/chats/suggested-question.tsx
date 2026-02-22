'use client'


interface SuggestedQuestionProp {
    text: string
    onClick: () => void
}

export const SuggestedQuestion = ({ text, onClick }: SuggestedQuestionProp) => {
  
    return (
        <button 
          onClick={onClick}
          className='w-[232px] max-h-[140px] h-full flex flex-col gap-2 items-center justify-between px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
        >
            <div className='w-[30px] h-[30px] bg-[#FEFAEE] rounded-full'></div>
            <p className='text-center text-[15px] font-normal'>{text}</p>
        </button>
    )
}