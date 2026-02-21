"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MealCard, { SpotlightedMeal, TopInsight } from "@/components/explore/meal-card"
import { InsightCard } from "@/components/explore/insight-card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen } from "lucide-react"
import { useProductsStore } from '@/store/products.store';
import { Skeleton } from '@/components/ui/skeleton';

type TabType = 'discover' | 'meals' | 'insights' | 'products';

const Explore = () => {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const { 
    recommendedMeals, 
    fetchRecommendedMeals, 
    fetchAllBlogs, 
    blogs, 
    isLoading 
  } = useProductsStore();
  const router = useRouter();
  
  useEffect(() => {
    fetchRecommendedMeals();
    fetchAllBlogs();
  }, [fetchRecommendedMeals, fetchAllBlogs]);

  // Get a random featured meal for the spotlight
  const featuredMeal = recommendedMeals.length > 0 
    ? recommendedMeals[Math.floor(Math.random() * recommendedMeals.length)] 
    : null;

  // Filter meals for the meals tab
  const mealsTabContent = recommendedMeals.filter(meal => meal.course === 'Main');
  
  return (
    <section className="satoshi p-4 max-w-[1086px] mx-auto">
      <div className="flex items-center mt-14 justify-between">
        <ul className="flex items-center">
          <li 
            className={`p-[10px] text-[30px] font-bold cursor-pointer ${activeTab === 'discover' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </li>
          <li 
            className={`p-[10px] text-[30px] font-bold cursor-pointer ${activeTab === 'meals' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('meals')}
          >
            Meals
          </li>
          <li 
            className={`p-[10px] text-[30px] font-bold cursor-pointer ${activeTab === 'insights' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
          </li>
          <li 
            className={`p-[10px] text-[30px] font-bold cursor-pointer ${activeTab === 'products' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
        </ul>
        <div className="relative w-[352px]">
          <Input
            type="text"
            placeholder='Try searching for Jollof Rice'
            className="pl-10 pr-4 py-2 w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const searchTerm = e.currentTarget.value.trim();
                if (searchTerm) {
                  // Find a matching meal
                  // const matchingMeal = recommendedMeals.find(meal => 
                  //   meal.mealName?.toLowerCase().includes(searchTerm.toLowerCase())
                  // );
                  
                  router.push(`/meals/${encodeURIComponent(searchTerm.toLowerCase())}`);
                  // if (matchingMeal) {
                  // }
                }
              }
            }}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

      </div>

      {activeTab === 'discover' && (
        <>
          <div className="flex gap-5 flex-col lg:flex-row">
            {featuredMeal ? (
              <SpotlightedMeal 
                meals={recommendedMeals}
              />
            ) : (
              <Skeleton className="w-[716px] h-[300px] rounded-[20px] bg-white" />
            )}
            <TopInsight blogs={blogs} />
          </div>

          <div className="mt-[40px]">
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
              <Clock />
              <p className='text-[14px] font-medium'>Recommended Meals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="w-full h-[300px] rounded-[20px] bg-white" />
                ))
              ) : recommendedMeals.length > 0 ? (
                recommendedMeals.slice(0, 6).map((meal) => (
                  <MealCard 
                    key={meal.$id}
                    name={meal.name}
                    description={meal.description}
                    imageUrl={meal.imageUrl}
                    rating={Math.floor(Math.random() * 20) + 70} // Random rating between 70-90
                  />
                ))
              ) : (
                <p className="text-gray-500">No recommended meals found</p>
              )}
            </div>
              {recommendedMeals.length > 6 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('meals')}
                  className="mt-2"
                >
                  View All Meals
                </Button>
              </div>
            )}
          </div>
          
          {/* Insights Section in Discover Tab */}
          <div className="mt-16">
            <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
              <BookOpen size={18} />
              <p className='text-[14px] font-medium'>Featured Insights</p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={`insight-skeleton-${i}`} className="w-full h-64 rounded-[20px]" />
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(0, 6).map((blog) => (
                  <InsightCard
                    key={`discover-${blog.id}`}
                    id={blog.id}
                    title={blog.title}
                    category={blog.category}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No insights available at the moment.</p>
            )}
            
            {blogs.length > 6 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('insights')}
                  className="mt-2"
                >
                  View All Insights
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'meals' && (
        <div className="mt-8">
          <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
            <Clock />
            <p className='text-[14px] font-medium'>All Meals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-full h-[300px] rounded-[20px]" />
              ))
            ) : recommendedMeals.length > 0 ? (
              recommendedMeals.map((meal) => (
                <MealCard 
                  key={meal.$id}
                  name={meal.name}
                  description={meal.description}
                  imageUrl={meal.imageUrl}
                  rating={Math.floor(Math.random() * 20) + 70} // Random rating between 70-90
                />
              ))
            ) : (
              <p className="text-gray-500">No meals found</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="mt-8">
          <div className='text-[#A3A3A3] flex items-center gap-2 mb-5'>
            <BookOpen size={18} />
            <p className='text-[14px] font-medium'>Latest Insights</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-full h-64 rounded-[20px]" />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <InsightCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  category={blog.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No insights available at the moment.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => fetchAllBlogs()}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'products' && (
        <div className="mt-20 text-center text-gray-500">
          <p>Coming soon! This section is under development.</p>
        </div>
      )}
    </section>
  )
}

export default Explore