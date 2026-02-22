"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { DietTypeFormValues, dietTypeOptions } from "@/models/validations/auth.validation";

// Map the diet type options to the format needed for the radio group
const dietOptions = dietTypeOptions.map(option => ({
  id: option.toLowerCase(),
  label: option,
  description: getDietDescription(option)
}));

function getDietDescription(diet: string): string {
  switch (diet) {
    case 'Vegetarian':
      return 'I don\'t eat meat, but I do eat dairy and eggs';
    case 'Vegan':
      return 'I don\'t eat any animal products';
    case 'Pescatarian':
      return 'I don\'t eat meat, but I do eat fish and seafood';
    case 'Keto':
      return 'I follow a high-fat, low-carb ketogenic diet';
    case 'Paleo':
      return 'I eat foods similar to what might have been eaten during the Paleolithic era';
    case 'Mediterranean':
      return 'I follow a diet rich in fruits, vegetables, whole grains, and healthy fats';
    case 'Flexitarian':
      return 'I primarily eat vegetarian but occasionally eat meat or fish';
    default:
      return 'My diet doesn\'t fit the standard categories';
  }
}

interface DietTypeProps {
  form: UseFormReturn<DietTypeFormValues>;
  onSubmit: (values: DietTypeFormValues) => void;
}

export function DietType({ form, onSubmit }: DietTypeProps) {

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What's your diet type?</h2>
          <p className="text-muted-foreground">
            This helps us recommend recipes and meal plans that fit your dietary preferences.
          </p>
          
          <FormField
            control={form.control}
            name="dietType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid gap-4 pt-4"
                  >
                    {dietOptions.map((option) => (
                      <FormItem
                        key={option.id}
                        className={`flex items-start space-x-3 space-y-0 rounded-lg border p-4 ${
                          field.value === option.id ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium">
                            {option.label}
                          </FormLabel>
                          <FormDescription>
                            {option.description}
                          </FormDescription>
                        </div>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button type="submit" className="ml-auto">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default DietType;