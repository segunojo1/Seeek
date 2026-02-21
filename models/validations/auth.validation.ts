
import * as z from "zod"

export const signupSchema = z.object({
  FirstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  LastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  Email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  Password: z.string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    }),
  ConfirmPassword: z.string(),
}).refine((data) => data.Password === data.ConfirmPassword, {
  message: "Passwords don't match",
  path: ["ConfirmPassword"],
})

export const biodataSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  height: z.number().min(1, 'Height is required'),
  weight: z.number().min(1, 'Weight is required'),
  skinType: z.string().min(1, 'Skin type is required'),
  nationality: z.string().min(1, 'Nationality is required')
})

export const dietTypeSchema = z.object({
  dietType: z.string().min(1, 'Please select a diet type')
})

export const allergiesSchema = z.object({
  allergies: z.array(z.string()).min(0)
})

export const userGoalsSchema = z.object({
  userGoals: z.array(z.string()).min(1, 'Please select at least one goal')
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false).optional(),
})

export const aboutSchema = z.object({
  role: z.string().min(2, 'Please select role'),
  school: z.string().min(2, 'Please enter school'),
  department: z.string(),
  interests: z.string()
})

export const dietTypeOptions = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Flexitarian',
  'Other'
] as const;

export const allergyOptions = [
  'Dairy',
  'Eggs',
  'Peanuts',
  'Tree Nuts',
  'Soy',
  'Wheat',
  'Fish',
  'Shellfish',
  'Sesame',
  'None'
] as const;

export const userGoalOptions = [
  'Lose weight',
  'Gain weight',
  'Build muscle',
  'Improve fitness',
  'Eat healthier',
  'Manage a health condition',
  'Increase energy levels',
  'Improve sleep',
  'Reduce stress',
  'Other'
] as const;

export interface AboutFormValues {
  role: string;
  school: string;
  department: string;
  interests: string;
}

export interface SignupFormValues {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

export interface BiodataFormValues {
  dateOfBirth: string;
  gender: string;
  height: number;
  weight: number;
  skinType: string;
  nationality: string;
}

export interface DietTypeFormValues {
  dietType: string;
}

export interface AllergiesFormValues {
  allergies: string[];
}

export interface UserGoalsFormValues {
  userGoals: string[];
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
} 
