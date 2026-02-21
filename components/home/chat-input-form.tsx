"use client"

import { FormField, FormItem, FormControl, Form } from "@/components/ui/form"
import { chatSchema } from "@/models/validations/chat.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { X, FileText,  Mic, MicOff } from "lucide-react"
import { useChatStore } from "@/store/chat.store"
import { useScanStore } from "@/store/scan.store"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import Image from "next/image"
import { ArrowUp, Loader } from "lucide-react"
import { FormMessage } from "../ui/form"
import { useRouter } from "next/navigation"

// Speech recognition types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}


const ChatInputForm = ({ 
  onSend, 
  disabled 
}: { 
  onSend: (message: string, file?: File) => void, 
  disabled?: boolean 
}) => {
  // Check if the browser supports the Web Speech API
  const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [mode, setMode] = useState<'ask' | 'search' | 'scan'>('ask')
  const [isListening, setIsListening] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0)
  const [interimTranscript, setInterimTranscript] = useState<string>('')
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        setInterimTranscript('')
      }
      setIsListening(false)
    } else {
      // Start listening
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        toast.error('Speech recognition is not supported in your browser')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      
      // Add event listener for volume/sound detection
      if ('webkitAudioContext' in window) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then((stream) => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            const updateVolume = () => {
              if (!isListening) return;
              analyser.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
              setVolume(Math.min(100, average * 0.5)); // Scale and cap the volume
              requestAnimationFrame(updateVolume);
            };
            updateVolume();
          })
          .catch((error) => {
            console.error('Error accessing microphone:', error);
          });
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          form.setValue('chat', form.getValues('chat') + finalTranscript, { shouldValidate: true });
        }
        setInterimTranscript(interimTranscript);
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        toast.error('Error occurred in speech recognition')
        setIsListening(false)
        setInterimTranscript('')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      try {
        recognition.start()
        setIsListening(true)
        recognitionRef.current = recognition
      } catch (error) {
        console.error('Speech recognition start failed:', error)
        toast.error('Failed to start speech recognition')
      }
    }
  }
  const router = useRouter()

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      chat: "",
    },
  })

  const { isLoading } = useChatStore()
  const { scanImage, isScanning } = useScanStore()

  const handleSubmit = async (values: z.infer<typeof chatSchema>) => {
    const message = values.chat.trim()
    
    if (!message && !selectedFile) return

    try {
      if (mode === 'search' && message) {
        // For search mode, navigate to /meals/{query}
        router.push(`/meals/${encodeURIComponent(message)}`)
        return
      } else if (mode === 'scan' && selectedFile) {
        // For scan mode, call the image scan API then navigate to results
        const result = await scanImage(selectedFile)
        if (result) {
          router.push('/meal/scan')
        } else {
          toast.error('Failed to analyze the image. Please try again.')
        }
      } else {
        // For ask mode or when there's no file in scan mode
        onSend(message, selectedFile || undefined)
      }
      
      form.reset()
      setSelectedFile(null)
      setPreviewUrl('')
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Failed to ${mode === 'search' ? 'search' : mode === 'scan' ? 'scan image' : 'send message'}`)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For scan mode, only allow images
    if (mode === 'scan' && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    // For other modes, only allow PDFs
    else if (mode !== 'scan' && file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported for this mode')
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    
    // If in scan mode and no message, auto-submit
    if (mode === 'scan' && !form.getValues('chat')?.trim()) {
      form.handleSubmit(handleSubmit)()
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 w-full">
          {/* File preview section */}
          {(selectedFile || previewUrl) && (
            <div className="relative w-full max-w-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2C2C2C] rounded-lg p-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {mode === 'scan' && previewUrl ? (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden">
                      <Image 
                        src={previewUrl} 
                        alt="Scanned food" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {mode === 'scan' ? 'Scanned Food' : selectedFile?.name}
                    </p>
                    {mode !== 'scan' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {selectedFile?.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      {mode === 'scan' && form.getValues('chat') && (
                        <>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {form.getValues('chat')}
                          </span>
                          <a 
                            href={`/meals/${encodeURIComponent(form.getValues('chat'))}`}
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1 whitespace-nowrap"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/meals/${encodeURIComponent(form.getValues('chat'))}`);
                            }}
                          >
                            <span>Open in page</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </>
                      )}
                      {mode !== 'scan' && (
                        <button
                          type="button"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                          onClick={() => {
                            if (selectedFile) {
                              window.open(previewUrl, '_blank')
                            }
                          }}
                        >
                          <span>Open in new tab</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-transparent"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="chat"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative min-w-[750px] border-[0.3px] border-[#D4D4D480] bg-white dark:bg-[#2C2C2C] rounded-[12px] overflow-hidden">
                    <Textarea
                      placeholder={
                        mode === 'ask'
                          ? "Ask anything… or type @ to see Clark's magic commands..."
                          : mode === 'search'
                            ? "Search for meals..."
                            : "Take or upload a photo of food..."
                      }
                      {...field}
                      className="whitespace-pre-wrap min-h-[100px] max-h-[180px] text-[16px] max-w-[750px] font-medium p-3 w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none resize-none !bg-[#2C2C2C]"
                    />
                    <div className="flex items-center gap-2 p-2 border-[#D4D4D4] bg-[#2C2C2C]">
                      <Tabs
                        value={mode}
                        onValueChange={(value) => {
                          setMode(value as 'ask' | 'search' | 'scan')
                          // Clear file when switching to search mode
                          if (value === 'search' && selectedFile) {
                            removeFile()
                          }
                        }}
                        className="flex-1"
                      >
                        <TabsList className="bg-[#F5F5F5] dark:bg-[#262626] rounded-[8px] p-0 py-5 px-2 h-8 justify-start gap-1">
                          <TabsTrigger
                            value="ask"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#FEF6E9] py-4 data-[state=active]:shadow-none rounded-md px-4 h-full text-sm font-medium dark:data-[state=active]:text-black data-[state=active]:text-[#FF3D00]"
                          >
                            Ask
                          </TabsTrigger>
                          <TabsTrigger
                            value="search"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#FEF6E9] py-4 data-[state=active]:shadow-none rounded-md px-4 h-full text-sm font-medium dark:data-[state=active]:text-black data-[state=active]:text-[#FF3D00]"
                          >
                            Search
                          </TabsTrigger>
                          <TabsTrigger
                            value="scan"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#FEF6E9] py-4 data-[state=active]:shadow-none rounded-md px-4 h-full text-sm font-medium dark:data-[state=active]:text-black data-[state=active]:text-[#FF3D00]"
                          >
                            Scan
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div 
                            onClick={triggerFileInput}
                            className={`rounded-md ${mode === 'scan' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            title={mode === 'scan' ? 'Take or upload food photo' : 'Attach file'}
                          >
                            
                              <Image 
                                src="/assets/paper-clip.svg" 
                                alt="Attach file" 
                                width={20} 
                                height={20} 
                                className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" 
                              />
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept={mode === 'scan' ? 'image/*' : 'application/pdf'}
                            capture={mode === 'scan' ? 'environment' : undefined}
                            className="hidden"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={toggleListening}
                          disabled={!isSpeechSupported}
                          className={`relative p-1.5 rounded-full transition-all duration-200 ${
                            isListening 
                              ? 'bg-red-100 text-red-500 animate-pulse' 
                              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700'
                          }`}
                          title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                          {isListening ? (
                            <div className="relative">
                              <MicOff className="h-5 w-5" />
                              <div 
                                className="absolute -inset-1 rounded-full bg-red-100 opacity-75"
                                style={{
                                  transform: `scale(${1 + (volume / 200)})`,
                                  transition: 'transform 0.1s ease-out'
                                }}
                              />
                            </div>
                          ) : (
                            <Image width={20} height={20} alt="" src="/assets/waveform.svg" className="h-5 w-5" />
                          )}
                        </button>

                        <Image src="/assets/@.svg" alt="" width={21} height={30} className="ml-1" />
                        
                        {/* Voice input indicator */}
                        {isListening && (
                          <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-white dark:bg-[#2C2C2C] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                  <Mic className="h-5 w-5 text-red-500" />
                                </div>
                                <div 
                                  className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/20 opacity-75 animate-ping"
                                  style={{
                                    transform: `scale(${1 + (volume / 50)})`,
                                    transition: 'transform 0.1s ease-out'
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                  {interimTranscript ? 'Listening...' : 'Speak now...'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                  {interimTranscript || 'Listening for speech...'}
                                </div>
                                <div className="flex items-center mt-2">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div 
                                      key={i}
                                      className="h-1 mx-0.5 bg-red-400 rounded-full transition-all duration-200"
                                      style={{
                                        width: '4px',
                                        height: `${Math.max(4, Math.random() * 20 + 4)}px`,
                                        opacity: 0.3 + (Math.random() * 0.7)
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={toggleListening}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )}
                        <Button
                          type="submit"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-[#262626] hover:bg-[#FF3D00]/90"
                          disabled={disabled || isLoading || isScanning}
                        >
                          {isLoading || isScanning ? (
                            <Loader className="h-4 w-4 text-[#ffffff] animate-spin" />
                          ) : (
                            <ArrowUp className="h-4 w-4 text-[#ffffff]" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default ChatInputForm