
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form'
import { Checkbox } from "../ui/checkbox"
import { AllergiesFormValues } from './types';
import { allergyOptions } from "@/models/validations/auth.validation"

interface AllergiesProps {
  form: UseFormReturn<AllergiesFormValues>;
  onSubmit: (values: AllergiesFormValues) => void;
}

const Allergies = ({ form, onSubmit }: AllergiesProps) => {
  const handleSubmit = (values: AllergiesFormValues) => {
    console.log('Selected allergies:', values.allergies);
    onSubmit(values);
  }

  return (
    <section>
      <h1 className='text-[60px] font-semibold text-[#737373] mb-8'>Do you have any food allergies?</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 satoshi flex flex-col">
          <FormField
            control={form.control}
            name="allergies"
            render={() => (
              <FormItem className="space-y-4">
                <div className="space-y-4">
                  {allergyOptions.map((allergy) => (
                    <FormField
                      key={allergy}
                      control={form.control}
                      name="allergies"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={allergy}
                            className={`flex items-center justify-between border transition-all ${field.value?.includes(allergy)
                              ? 'border-[#F9E8CD] text-[#F9E8CD]'
                              : 'border-[#D4D4D4]'
                              } py-3 px-4 rounded-[5px] space-y-0`}
                          >
                            <FormLabel className="font-normal cursor-pointer flex-1">
                              {allergy}
                            </FormLabel>
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(allergy)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], allergy])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== allergy
                                      )
                                    )
                                }}
                                className="text-[#F9E8CD] !data-[state=checked]:text-[#F9E8CD]"
                              />
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-black bg-[#F9E8CD] hover:bg-orange-500/90 rounded-[5px] h-12 text-lg"
          >
            Continue
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default Allergies