import { create } from 'zustand';
import { productService, MealRecommendation, MealPlan, BlogPost, MealDetails } from '@/services/products.service';

interface ProductsStore {
  // Existing meal-related state
  recommendedMeals: MealRecommendation[];
  mealPlan: MealPlan | null;
  
  // Blog-related state
  blogs: BlogPost[];
  currentBlog: BlogPost | null;
  
  // Common state
  isLoading: boolean;
  error: string | null;
  
  // Meal actions
  fetchRecommendedMeals: () => Promise<void>;
  generateMealPlan: () => Promise<void>;
  setRecommendedMeals: (meals: MealRecommendation[]) => void;
  setMealPlan: (plan: MealPlan | null) => void;
  
  // Blog actions
  fetchAllBlogs: () => Promise<void>;
  
  currentMeal: MealDetails | null;
  fetchMealDetails: (mealName: string, profileId: string) => Promise<MealDetails | null>;
  setCurrentMeal: (meal: MealDetails | null) => void;
  fetchBlogById: (id: string) => Promise<BlogPost | null>;
  setCurrentBlog: (blog: BlogPost | null) => void;
  
  // Common actions
  clearError: () => void;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // Initial state
  recommendedMeals: [],
  mealPlan: null,
  blogs: [],
  currentBlog: null,
  currentMeal: null,
  isLoading: false,
  error: null,
  
  // Meal details actions
  setCurrentMeal: (meal) => set({ currentMeal: meal }),
  
  fetchMealDetails: async (mealName, profileId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await productService.getMealDetails(mealName, profileId);
      
      if (error) {
        console.warn('Error in meal details response:', error);
        // Continue even if there's an error, as we want to try to display what we have
      }
      
      if (data) {
        set({ currentMeal: data?.value });
        return data?.value;
      }
      
      // If we get here, there was no data and no error was thrown
      throw new Error('No meal data available');
    } catch (error) {
      console.error('Error in fetchMealDetails:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch meal details',
        currentMeal: null
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRecommendedMeals: async () => {
    try {
      set({ isLoading: true, error: null });
      const meals = await productService.getRecommendedMeals();
      set({ recommendedMeals: meals });
    } catch (error) {
      console.error('Error in fetchRecommendedMeals:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch recommended meals',
        recommendedMeals: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  generateMealPlan: async () => {
    try {
      set({ isLoading: true, error: null });
      const plan = await productService.generateMealPlan();
      set({ mealPlan: plan });
    } catch (error) {
      console.error('Error in generateMealPlan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate meal plan',
        mealPlan: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setRecommendedMeals: (meals: MealRecommendation[]) => {
    set({ recommendedMeals: meals });
  },

  setMealPlan: (plan: MealPlan | null) => {
    set({ mealPlan: plan });
  },

  clearError: () => {
    set({ error: null });
  },
  
  // Blog actions
  fetchAllBlogs: async () => {
    try {
      set({ isLoading: true, error: null });
      const blogs = await productService.getAllBlogs();
      set({ blogs });
    } catch (error) {
      console.error('Error in fetchAllBlogs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch blogs',
        blogs: []
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchBlogById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const blog = await productService.getBlogById(id);
      if (blog) {
        set({ currentBlog: blog });
      }
      return blog;
    } catch (error) {
      console.error('Error in fetchBlogById:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch blog post',
        currentBlog: null
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  setCurrentBlog: (blog: BlogPost | null) => {
    set({ currentBlog: blog });
  },
}));