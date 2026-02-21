export const SIGNUP_STEPS = {
  SIGNUP: 'signup',
  VERIFY_EMAIL: 'verify-email',
  BIODATA: 'about-you',
  DIET_TYPE: 'diet-type',
  ALLERGIES: 'allergies',
  USER_GOALS: 'user-goals'
} as const;

export type SignupStep = typeof SIGNUP_STEPS[keyof typeof SIGNUP_STEPS];

// Define the steps in the correct order
export const SIGNUP_FLOW_STEPS = [
  SIGNUP_STEPS.SIGNUP,
  SIGNUP_STEPS.VERIFY_EMAIL,
  SIGNUP_STEPS.BIODATA,
  SIGNUP_STEPS.DIET_TYPE,
  SIGNUP_STEPS.ALLERGIES,
  SIGNUP_STEPS.USER_GOALS
] as const;

export type SignupFlowStep = typeof SIGNUP_FLOW_STEPS[number];
