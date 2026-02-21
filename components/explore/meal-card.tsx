import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// Helper function to get a consistent daily value based on the current date
const getDailyValue = <T,>(items: T[]): T => {
  if (items.length === 0) return null as unknown as T;
  
  const today = new Date().toDateString();
  const dailyIndex = Math.abs(
    today.split('').reduce((hash, char) => {
      return (hash << 5) - hash + char.charCodeAt(0);
    }, 0)
  ) % items.length;
  
  return items[dailyIndex];
};

interface MealItem {
  name: string;
  description: string;
  rating?: number;
  imageUrl?: string;
  id?: string;
  category?: string;
  // Add other meal properties that might be needed
}

interface SpotlightedMealProps {
  meals: MealItem[];
}

export const SpotlightedMeal = ({ meals = [] }: SpotlightedMealProps) => {
  // Get a consistent daily meal
  const dailyMeal = getDailyValue(meals);
  
  if (!dailyMeal) {
    return null;
  }
  
  const { name, description } = dailyMeal;
  
  return (
    <Card className='bg-[#2C2C2C] relative w-full lg:w-[716px] min-h-full border-[0.5px] border-[#404040] rounded-[20px] p-0 hover:border-[#F9E8CD] transition-colors duration-200'>

      <div className='px-5 pt-2'>
        <h2 className='text-[24px] font-bold'>{name}</h2>
        <p className='text-[#A3A3A3] text-[14px] mt-2 line-clamp-3'>{description}</p>
      </div>
      <div className='px-5 pb-5 mt-4'>
        <Link 
          href={`/meals/${encodeURIComponent(name.toLowerCase())}`} 
          className='text-[#F9E8CD] text-sm font-medium flex gap-1 items-center hover:opacity-80 transition-opacity w-fit'
        >
          View details <ChevronRight width={14} height={14} />
        </Link>
      </div>
    </Card>
  )
}


interface TopInsightProps {
  blogs: Array<{
    id: string;
    title: string;
    category: string;
  }>;
}

export const TopInsight = ({ blogs = [] }: TopInsightProps) => {
  // Get a consistent daily blog
  const dailyBlog = getDailyValue(blogs);
  
  if (!dailyBlog) {
    return null;
  }

  return (
    <Card className='bg-[#2C2C2C] p-0 relative justify-between min-h-full border-[0.5px] border-[#404040] rounded-[20px] max-w-[346px] py-[10px] hover:border-[#F9E8CD] transition-colors duration-200'>
      <div className='flex items-center justify-between px-5 pt-3 pb-2'>
        <h2 className='text-lg font-medium'>Today's Top Insight</h2>
        <Image 
          src='/assets/star1.png' 
          alt='Featured Insight' 
          width={36} 
          height={36} 
          className='opacity-80 hover:opacity-100 transition-opacity'
        />
      </div>
      <CardContent className='px-5 py-2'>
        <p className='text-xl leading-tight font-bold line-clamp-3'>{dailyBlog.title}</p>
      </CardContent>
      <Link 
        href={`/insights/${dailyBlog.id}`} 
        className='text-[#F9E8CD] text-sm font-medium flex gap-1 items-center px-5 py-3 hover:opacity-80 transition-opacity'
      >
        Read <ChevronRight size={16} />
      </Link>
    </Card>
  );
}



interface MealCardProps {
  name: string;
  description: string;
  imageUrl?: string;
  rating: number;
}

const MealCard = ({ name, description, imageUrl, rating }: MealCardProps) => {
  return (
    <div className="h-full">
      <Card className='bg-[#2C2C2C] relative w-full h-full p-5 border-[0.5px] border-[#404040] rounded-[20px] hover:border-[#F9E8CD] transition-colors duration-200'>
        <CardContent className='p-0 space-y-4 h-full flex flex-col'>
          
          <h3 className="text-xl font-semibold line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2">
            <Image src='/assets/rating-icon.svg' alt='rating' width={24} height={24} />
            <span className="text-lg font-medium">
              <span className="text-[#B4F1CF]">{rating}</span>/100
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-3 flex-grow">{description}</p>
          <Link 
            href={`/meals/${encodeURIComponent(name.toLowerCase())}`} 
            className='text-[#F9E8CD] text-sm font-medium flex gap-1 items-center mt-auto self-start hover:opacity-80 transition-opacity'
          >
            View details <ChevronRight width={14} height={14} />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default MealCard