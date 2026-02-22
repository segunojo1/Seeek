import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BiodataFormValues } from './types';
import { Input } from "@/components/ui/input";
// Calendar component is not used in this implementation
// Date formatting will be handled by the browser's native date input

interface BiodataProps {
  form: UseFormReturn<BiodataFormValues>;
  onSubmit: (values: BiodataFormValues) => void;
}

const Biodata = ({ form, onSubmit }: BiodataProps) => {
  const handleSubmit = (values: BiodataFormValues) => {
    console.log('Biodata submitted:', values);
    onSubmit(values);
  };

  return (
    <section>
      <h1 className='text-[60px] font-semibold text-[#737373]'>Tell us about yourself</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 satoshi flex flex-col">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="h-12 rounded-[5px] border-[#D4D4D4]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <FormItem
                        key={gender}
                        className={`flex items-center justify-between border transition-all ${field.value === gender
                            ? 'border-[#F9E8CD] text-[#F9E8CD]'
                            : 'border-[#D4D4D4]'
                          } py-3 px-4 rounded-[5px] space-y-0`}
                      >
                        <FormLabel className="font-normal cursor-pointer">
                          {gender}
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem
                            value={gender}
                            className="text-[#F9E8CD] data-[state=checked]:text-[#F9E8CD]"
                          />
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="h-12 rounded-[5px] border-[#D4D4D4]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="h-12 rounded-[5px] border-[#D4D4D4]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="skinType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Skin Type</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}
                                        defaultValue={field.value}>
                    <SelectTrigger className="flex h-12 w-full rounded-[5px] border border-[#D4D4D4] bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <SelectValue placeholder="Select skin type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Type I', 'Type II', 'Type III', 'Type IV', 'Type V', 'Type VI'].map((type) => (
                        <SelectItem  key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* <select
                    {...field}
                    className="flex h-12 w-full rounded-[5px] border border-[#D4D4D4] bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select skin type</option>
                    {['Type I', 'Type II', 'Type III', 'Type IV', 'Type V', 'Type VI'].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Nationality</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your nationality"
                    {...field}
                    className="h-12 rounded-[5px] border-[#D4D4D4]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#F9E8CD] hover:bg-orange-500/90 text-black rounded-[5px] h-12 text-lg"
          >
            Continue
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default Biodata