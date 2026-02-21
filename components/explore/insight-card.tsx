import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

const categoryIcons: Record<string, string> = {
  nutrition: '/assets/nutrition.svg',
  fitness: '/assets/fitness.svg',
  meals: '/assets/meals.svg',
  default: '/assets/products.svg',
};

interface InsightCardProps {
  id: string;
  title: string;
  category: string;
  className?: string;
}

export const InsightCard = ({ id, title, category, className = '' }: InsightCardProps) => {
  const iconSrc = categoryIcons[category.toLowerCase()] || categoryIcons.default;
  
  return (
    <Link href={`/insights/${id}`} className={`block h-full ${className}`}>
      <Card className='bg-[#2C2C2C] h-full border-[0.5px] border-[#404040] rounded-[20px] hover:border-[#F9E8CD] transition-colors duration-200 group'>
        <CardContent className='p-6 h-full flex flex-col'>
          <div className='flex justify-between items-start mb-4'>
            <span className='px-3 py-1 bg-[#404040] text-xs font-medium rounded-full text-gray-300'>
              {category}
            </span>
            <div className='w-8 h-8 relative'>
              <Image 
                src={iconSrc} 
                alt={category} 
                width={32} 
                height={32}
                className='opacity-70 group-hover:opacity-100 transition-opacity'
              />
            </div>
          </div>
          
          <h3 className='text-lg font-semibold mb-4 line-clamp-3 group-hover:text-[#F9E8CD] transition-colors'>
            {title}
          </h3>
          
          <div className='mt-auto pt-4 border-t border-[#404040] flex items-center text-[#F9E8CD] text-sm font-medium group-hover:underline'>
            Read <ChevronRight className='ml-1' size={16} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default InsightCard;
