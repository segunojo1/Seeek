'use client'

import { Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { useEffect } from 'react';
import { useProductsStore } from '@/store/products.store';

const RecommendedProducts = () => {
  const { recommendedMeals, fetchRecommendedMeals, isLoading } = useProductsStore();

  useEffect(() => {
    fetchRecommendedMeals();
  }, [fetchRecommendedMeals]);

  if (isLoading) {
    return (
      <section className='mt-[50px]'>
        <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
          <Clock />
          <p className='text-[14px] font-medium'>Loading Recommendations...</p>
        </div>
      </section>
    );
  }

  // Filter out any invalid meal names (like *&^@!#) and limit to 5 items
  const validMeals = recommendedMeals
    .filter(meal => meal.name && !/^[^a-zA-Z0-9]+$/.test(meal.name))
    .slice(0, 5);

  return (
    <section className='mt-[50px]'>
      <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
        <Clock />
        <p className='text-[14px] font-medium'>Recommended Meals/Products</p>
      </div>

      <div className='flex gap-4 overflow-x-auto pb-4'>
        {validMeals.length > 0 ? (
          validMeals.map((meal) => (
            <Card
              key={meal.$id}
              className="text-[#525252] dark:text-[#A3A3A3] bg-white dark:bg-[#2C2C2C] rounded-[10px] p-0 h-[150px] w-[150px] shadow-none flex-shrink-0"
            >
              <div className='h-[100px] rounded-t-[10px] w-full bg-[#F9E8CD] dark:bg-[#F9E8CD] relative overflow-hidden'>
                {meal.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src='/assets/smallstar.svg'
                      alt=''
                      width={40}
                      height={40}
                      className="opacity-30"
                    />
                  </div>
                )}
              </div>
              <CardContent className="p-2 !gap-1">
                <h4 className="text-sm font-medium line-clamp-2">{meal.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{meal.description}</p>
                {/* {meal.course && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 mt-1 inline-block">
                    {meal.course}
                  </span>
                )} */}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-[#525252] dark:text-[#A3A3A3] bg-white dark:bg-[#2C2C2C] rounded-[10px] p-4 w-full text-center">
            <p>No meal recommendations available. Complete your profile for personalized suggestions.</p>
          </Card>
        )}
      </div>
        </section>
    )
}

export default RecommendedProducts