import { UseFormReturn } from "react-hook-form";
import { 
  SignupFormValues, 
  BiodataFormValues, 
  DietTypeFormValues, 
  AllergiesFormValues, 
  UserGoalsFormValues 
} from "@/models/validations/auth.validation";

// Re-export the form value types for convenience
export type { 
  SignupFormValues, 
  BiodataFormValues, 
  DietTypeFormValues, 
  AllergiesFormValues, 
  UserGoalsFormValues 
} from "@/models/validations/auth.validation";

export interface SignUpFormProps {
  form: UseFormReturn<SignupFormValues>;
  onSubmit: (values: SignupFormValues) => void;
}

export interface VerifyEmailProps {
  email: string;
  onSuccess: (code: string) => void;
}

export interface BiodataProps {
  form: UseFormReturn<BiodataFormValues>;
  onSubmit: (values: BiodataFormValues) => void;
}

export interface DietTypeProps {
  form: UseFormReturn<DietTypeFormValues>;
  onSubmit: (values: DietTypeFormValues) => void;
}

export interface AllergiesProps {
  form: UseFormReturn<AllergiesFormValues>;
  onSubmit: (values: AllergiesFormValues) => void;
}

export interface UserGoalsProps {
  form: UseFormReturn<UserGoalsFormValues>;
  onSubmit: (values: UserGoalsFormValues) => void;
  isLoading: boolean;
}
