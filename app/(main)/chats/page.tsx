'use client'

import ChatInputForm from '@/components/home/chat-input-form'
import { HelpCircle } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useChatStore } from '@/store/chat.store'
import { useEffect, useState } from 'react'
import { ChatMessage } from '@/lib/types'
import { ChatMessageList } from '@/components/chats/message-list'
import { WelcomeScreen } from '@/components/chats/welcome-screen'

const Chat = () => {
  const { messages, isLoading, sendMessage, setCurrentChatId, fetchPreviousInteractions, setMessages } = useChatStore()
  const { chatId } = useParams()
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  // Set chat ID when component mounts and fetch previous interactions
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setCurrentChatId(chatId as string | null)
        
        // Only fetch previous interactions on first load when there are no messages
        if (!isInitialized && messages.length === 0) {
          const previousMessages = await fetchPreviousInteractions()
          if (previousMessages.length > 0) {
            setMessages(previousMessages)
          }
          setIsInitialized(true)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    initializeChat()
  }, [chatId, setCurrentChatId, fetchPreviousInteractions, messages.length, isInitialized, setMessages])

  const handleSend = async (message: string) => {
    if (!message.trim()) return
    await sendMessage(message)
  }

  return (
    <div className='w-full flex flex-col items-center bg-[#FAFAFA] dark:bg-[#262626] max-h-screen h-full'>
            <Image src='/assets/logo.png' alt='' width={103} height={90} className='mx-auto mb-[55px]' />
      
      <div className='flex flex-col justify-between h-full max-w-[750px] pb-10'>
      {!chatId && messages.length === 0 ? (
          <WelcomeScreen onSend={handleSend} />
        ) : (
          <ChatMessageList messages={messages} isLoading={isLoading} />
        )}
        <ChatInputForm onSend={handleSend} disabled={isLoading} />
      </div>
      <HelpCircle className='absolute bottom-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer' />
    </div>
  )
}

export default Chat