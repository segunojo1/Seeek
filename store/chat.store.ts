import { create } from 'zustand'
import { ChatMessage } from '@/lib/types'
import { chatService } from '@/services/chat.service'

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void
  clearMessages: () => void
  setIsLoading: (isLoading: boolean) => void
  sendMessage: (message: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message]
    }))
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setMessages: (messages: ChatMessage[]) => {
    set({ messages })
  },

  sendMessage: async (message: string) => {
    if (!message.trim()) return

    const { messages, addMessage, setIsLoading } = get()

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    }
    addMessage(userMessage)

    try {
      setIsLoading(true)

      // Send with current chat history (including the new user message)
      const allMessages = [...messages, userMessage]
      const response = await chatService.sendMessage(message, allMessages)
      addMessage(response)
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message.'
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  },
}))