"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import {
  signupSchema,
  biodataSchema,
  dietTypeSchema,
  allergiesSchema,
  userGoalsSchema,
  SignupFormValues,
  BiodataFormValues,
  DietTypeFormValues,
  AllergiesFormValues,
  UserGoalsFormValues,
} from "@/models/validations/auth.validation";
import SignUpForm from "@/components/auth/signup-form";
import VerifyEmail from "@/components/auth/verify-email";
import Biodata from "@/components/auth/biodata";
import DietType from "@/components/auth/diet-type";
import Allergies from "@/components/auth/allergies";
import UserGoals from "@/components/auth/user-goals";
import { motion, AnimatePresence } from "framer-motion";
import {
  SignUpFormProps,
  VerifyEmailProps,
  BiodataProps,
  DietTypeProps,
  AllergiesProps,
  UserGoalsProps,
} from "@/components/auth/types";

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 100,
    },
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 600 : -600,
    opacity: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 100,
    },
  }),
};

import {
  SIGNUP_STEPS,
  SignupStep,
  SIGNUP_FLOW_STEPS,
  SignupFlowStep,
} from "../../../_constants/signup-steps";
import AuthClientLayout from "@/components/layout/auth-layout";
import useAuthStore from "@/store/auth.store";

// Alias for backward compatibility
const STEPS = SIGNUP_FLOW_STEPS;
type StepType = SignupFlowStep;

const SignUpPage = () => {
  const router = useRouter();
  const { signupData, updateSignupData, nextStep, prevStep, resetSignup } =
    useAuthStore();

  const [currentStep, setCurrentStep] = useState<number>(
    signupData.currentStep || 0,
  );
  const [prevStepNum, setPrevStepNum] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(1);

  // Get the current step name
  const currentStepName = STEPS[currentStep] as SignupStep;

  // Handle navigation between steps
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setPrevStepNum(currentStep);
    }
  };

  // Go to a specific step
  const goToStep = (step: number) => {
    if (step >= 0 && step < STEPS.length) {
      setDirection(step > currentStep ? 1 : -1);
      setPrevStepNum(currentStep);
      setCurrentStep(step);
    }
  };

  // Update the current step when signupData changes
  useEffect(() => {
    if (signupData.currentStep !== undefined) {
      setCurrentStep(signupData.currentStep);
    }
  }, [signupData.currentStep]);

  // Move to the next step after OTP verification
  const handleOtpVerificationSuccess = (code?: string) => {
    if (code) {
      handleVerifyEmail(code).then(() => {
        // Only proceed to next step if verification is successful
        handleNextStep();
      });
    } else {
      handleNextStep();
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setPrevStepNum(currentStep);
    prevStep();
  };

  // Form handlers for each step
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      FirstName: signupData.FirstName || "",
      LastName: signupData.LastName || "",
      Email: signupData.Email || "",
      Password: signupData.Password || "",
      ConfirmPassword: signupData.ConfirmPassword || "",
    },
  });

  const biodataForm = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: {
      dateOfBirth: signupData.dateOfBirth || "",
      gender: signupData.gender || "",
      height: signupData.height || 0,
      weight: signupData.weight || 0,
      skinType: signupData.skinType || "",
      nationality: signupData.nationality || "",
    },
  });

  const dietTypeForm = useForm<DietTypeFormValues>({
    resolver: zodResolver(dietTypeSchema),
    defaultValues: {
      dietType: signupData.dietType || "",
    },
  });

  const allergiesForm = useForm<AllergiesFormValues>({
    resolver: zodResolver(allergiesSchema),
    defaultValues: {
      allergies: signupData.allergies || [],
    },
  });

  const userGoalsForm = useForm<UserGoalsFormValues>({
    resolver: zodResolver(userGoalsSchema),
    defaultValues: {
      userGoals: signupData.userGoals || [],
    },
  });

  // Handle signup form submission
  const handleSignupSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      // Store the form data in the store
      updateSignupData({
        ...values,
        currentStep: STEPS.indexOf(SIGNUP_STEPS.VERIFY_EMAIL),
      });

      // Send OTP to the user's email
      await authService.sendOtp(
        values.Email,
        `${values.FirstName} ${values.LastName}`,
      );

      // Move to the verify email step
      handleNextStep();
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyEmail = async (code: string): Promise<void> => {
    if (!signupData.Email) {
      throw new Error("Email is required for OTP verification");
    }

    try {
      setIsLoading(true);

      // Verify the OTP using the auth service
      const response = await authService.verifyOtp(signupData.Email, code);

      // Update the signup data with the verification status
      updateSignupData({
        ...signupData,
        userId: response.user?.id || signupData.userId,
        emailVerified: true,
        otp: code,
        currentStep: STEPS.indexOf(SIGNUP_STEPS.BIODATA),
      });

      // Move to the next step
      router.push("/auth/login");

      return Promise.resolve();
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.message || "Failed to verify OTP");
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiodataSubmit = async (values: BiodataFormValues) => {
    updateSignupData({
      ...signupData,
      ...values,
      currentStep: STEPS.indexOf(SIGNUP_STEPS.DIET_TYPE),
    });
    handleNextStep();
  };

  const handleDietTypeSubmit = async (values: DietTypeFormValues) => {
    updateSignupData({
      ...signupData,
      ...values,
      currentStep: STEPS.indexOf(SIGNUP_STEPS.ALLERGIES),
    });
    handleNextStep();
  };

  const handleAllergiesSubmit = async (values: AllergiesFormValues) => {
    updateSignupData({
      ...signupData,
      ...values,
      currentStep: STEPS.indexOf(SIGNUP_STEPS.USER_GOALS),
    });
    handleNextStep();
  };

  const handleUserGoalsSubmit = async (values: UserGoalsFormValues) => {
    try {
      setIsLoading(true);
      if (!signupData.userId) throw new Error("User ID not found");

      // Combine all the data with proper type assertions
      const profileData = {
        dateOfBirth: signupData.dateOfBirth as string,
        gender: signupData.gender as string,
        height: Number(signupData.height) || 0,
        weight: Number(signupData.weight) || 0,
        skinType: signupData.skinType as string,
        nationality: signupData.nationality as string,
        dietType: signupData.dietType as string,
        allergies: signupData.allergies || [],
        userGoals: values.userGoals,
      };

      // Create the profile
      await authService.createProfile(signupData.userId, profileData);

      // Reset the signup flow and redirect to dashboard
      resetSignup();
      console.log("before route");
      router.push("/home");
      console.log("after route");
    } catch (error) {
      console.error("Profile creation error:", error);
      throw error; // Re-throw to show error in the form
    } finally {
      setIsLoading(false);
    }
  };

  // Update form values when signupData changes
  useEffect(() => {
    if (signupData.Email) {
      signupForm.setValue("Email", signupData.Email);
    }
    if (signupData.FirstName) {
      signupForm.setValue("FirstName", signupData.FirstName);
    }
    if (signupData.LastName) {
      signupForm.setValue("LastName", signupData.LastName);
    }
  }, [signupData, signupForm]);

  const renderStep = () => {
    switch (currentStepName) {
      case SIGNUP_STEPS.SIGNUP:
        return (
          <SignUpForm
            key={SIGNUP_STEPS.SIGNUP}
            form={signupForm as SignUpFormProps["form"]}
            onSubmit={handleSignupSubmit}
          />
        );
      case SIGNUP_STEPS.VERIFY_EMAIL:
        return (
          <VerifyEmail
            key={SIGNUP_STEPS.VERIFY_EMAIL}
            email={signupData.Email || ""}
            onSuccess={async (code) => {
              if (code) {
                try {
                  await handleVerifyEmail(code);
                  handleNextStep();
                } catch (error) {
                  // Error is already handled in handleVerifyEmail
                }
              } else {
                toast.error("Verification code is required");
              }
            }}
          />
        );
      case SIGNUP_STEPS.BIODATA:
        return (
          <Biodata
            key={SIGNUP_STEPS.BIODATA}
            form={biodataForm as BiodataProps["form"]}
            onSubmit={handleBiodataSubmit}
          />
        );
      case SIGNUP_STEPS.DIET_TYPE:
        return (
          <DietType
            key={SIGNUP_STEPS.DIET_TYPE}
            form={dietTypeForm as DietTypeProps["form"]}
            onSubmit={handleDietTypeSubmit}
          />
        );
      case SIGNUP_STEPS.ALLERGIES:
        return (
          <Allergies
            key={SIGNUP_STEPS.ALLERGIES}
            form={allergiesForm as AllergiesProps["form"]}
            onSubmit={handleAllergiesSubmit}
          />
        );
      case SIGNUP_STEPS.USER_GOALS:
        return (
          <UserGoals
            key={SIGNUP_STEPS.USER_GOALS}
            form={userGoalsForm as UserGoalsProps["form"]}
            onSubmit={handleUserGoalsSubmit}
            isLoading={isLoading}
          />
        );
      default:
        // This should never happen, but just in case
        const _exhaustiveCheck: never = currentStepName;
        return null;
    }
  };

  const showSidebar = ["signup", "verify-email"].includes(currentStepName);

  return (
    <AuthClientLayout showSidebar={showSidebar} currentStep={currentStepName}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </AuthClientLayout>
  );
};

export default SignUpPage;
