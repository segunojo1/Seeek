import { z } from "zod";

export const chatSchema = z.object({
  chat:  z.string().max(2000)
})

export interface ChatFormValues {
    chat: string;
} 
  