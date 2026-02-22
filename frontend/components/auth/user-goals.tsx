"use client"

import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { UseFormReturn } from 'react-hook-form';
import { UserGoalsFormValues } from './types';
import { userGoalOptions } from "@/models/validations/auth.validation";

interface UserGoalsProps {
  form: UseFormReturn<UserGoalsFormValues>;
  onSubmit: (values: UserGoalsFormValues) => void;
  isLoading: boolean;
}

const UserGoals = ({ form, onSubmit, isLoading }: UserGoalsProps) => {
  const handleSubmit = (values: UserGoalsFormValues) => {
    console.log('Selected user goals:', values.userGoals);
    onSubmit(values);
  };

  return (
    <section>
      <h1 className='text-[60px] font-semibold text-[#737373] mb-8'>What are your health goals?</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 satoshi flex flex-col">
          <FormField
            control={form.control}
            name="userGoals"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="space-y-4">
                  {userGoalOptions.map((goal) => {
                    const isSelected = (field.value || []).includes(goal);
                    return (
                      <div
                        key={goal}
                        className={`flex items-center justify-between border rounded-lg p-4 transition-all ${
                          isSelected
                            ? 'border-[#F9E8CD] bg-transparent'
                            : 'border-[#D4D4D4] hover:border-orange-300'
                        }`}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const newValues = isSelected
                            ? currentValues.filter((v: string) => v !== goal)
                            : [...currentValues, goal];
                          field.onChange(newValues);
                        }}
                      >
                        <span className="text-base font-normal cursor-pointer flex-1">
                          {goal}
                        </span>
                        <div 
                          className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                            isSelected
                              ? 'bg-[#F9E8CD] border-[#F9E8CD]'
                              : 'border-[#D4D4D4]'
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-4 w-4 text-black" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-[#F9E8CD] hover:bg-orange-500/90 text-black rounded-[5px] h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </Form>
{/*       
      <div className="w-full flex flex-col gap-4">
        <Button 
          type="button" 
          className="bg-[#FF3D00] w-full py-3 h-12 text-base font-medium"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Continue'}
        </Button>
        
      </div> */}
    </section>
  );
};

export default UserGoals;