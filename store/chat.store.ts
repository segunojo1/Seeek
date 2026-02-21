import { create } from 'zustand'
import { ChatMessage } from '@/lib/types'
import { chatService } from '@/services/chat.service'

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  currentChatId: string | null
  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void
  clearMessages: () => void
  setIsLoading: (isLoading: boolean) => void
  setCurrentChatId: (chatId: string | null) => void
  sendMessage: (message: string, file?: File) => Promise<void>
  fetchPreviousInteractions: () => Promise<ChatMessage[]>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  currentChatId: null,

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

  setCurrentChatId: (chatId: string | null) => {
    set({ currentChatId: chatId })
  },

  setMessages: (messages: ChatMessage[]) => {
    set({ messages })
  },

  sendMessage: async (message: string, file?: File) => {
    if (!message.trim() && !file) return
console.log('send message');

    const { addMessage, setIsLoading } = get()

    // Add user message with optional file attachment
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      attachments: file ? [file] : []
    }
    addMessage(userMessage)

    try {
      setIsLoading(true)

      const response = await chatService.sendMessage(message)
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

  fetchPreviousInteractions: async () => {
    try {
      const { setIsLoading } = get()
      setIsLoading(true)
      
      const messages = await chatService.getPreviousInteractions()
      if (messages.length > 0) {
        // Only set messages if we got some back
        return messages
      }
      return []
    } catch (error) {
      console.error('Error fetching previous interactions:', error)
      return []
    } finally {
      get().setIsLoading(false)
    }
  }
}))