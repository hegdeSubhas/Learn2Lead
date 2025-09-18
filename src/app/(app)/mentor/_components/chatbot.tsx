"use client";

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Mic, MicOff, Send, Sparkles, Terminal, User, Volume2, VolumeX } from 'lucide-react';
import { getGuidanceAction } from '../actions';
import type { Message } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
    </Button>
  );
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ]);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialState = { success: false, messages: messages };
  const [state, formAction] = useActionState(getGuidanceAction, initialState);

  // Effect to handle state updates from the server action
  useEffect(() => {
    if (state?.messages && state.messages.length > messages.length) {
      const newMessages = state.messages.slice(messages.length);
      setMessages(prev => [...prev, ...newMessages]);
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.role === 'assistant' && isTTSEnabled) {
        speak(lastMessage.content);
      }
    }
  }, [state?.messages, messages.length, isTTSEnabled]);

  // Effect for scrolling to the bottom
   useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN'; // Set to Kannada
      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleTTS = () => {
    setIsTTSEnabled(prev => {
      if (!prev === false) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'kn-IN'; // Set to Kannada

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (inputRef.current) {
        inputRef.current.value = transcript;
        // The form must be submitted programmatically
        inputRef.current.form?.requestSubmit();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : '')}>
              {message.role === 'assistant' && (
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 text-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <Avatar>
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {useFormStatus().pending && (
              <div className="flex items-start gap-3">
                  <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                          <Sparkles />
                      </AvatarFallback>
                  </Avatar>
                   <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm flex items-center gap-2">
                       <Loader2 className="h-4 w-4 animate-spin"/>
                       <span>Thinking...</span>
                   </div>
              </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {state?.error && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {typeof state.error === 'string' ? state.error : 'An error occurred. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
        <form
          action={formAction}
          onSubmit={(e) => {
            const form = e.currentTarget;
            const userInput = (form.elements.namedItem('userInput') as HTMLInputElement).value;
            if (userInput.trim()) {
                setMessages(prev => [...prev, { role: 'user', content: userInput.trim() }]);
            }
          }}
          className="flex items-center gap-2"
        >
          {/* Hidden input to pass messages */}
          <input type="hidden" name="messages" value={JSON.stringify(messages)} />

          <Input
            ref={inputRef}
            name="userInput"
            placeholder="Type your message..."
            autoComplete="off"
            disabled={useFormStatus().pending}
          />
          <Button type="button" size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={handleVoiceInput} aria-label="Use voice">
            {isListening ? <MicOff /> : <Mic />}
          </Button>
          <SubmitButton />
          <Button type="button" size="icon" variant="outline" onClick={handleToggleTTS} aria-label="Toggle text-to-speech">
            {isTTSEnabled ? <Volume2 /> : <VolumeX />}
          </Button>
        </form>
      </div>
    </div>
  );
}
