
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import type { ChatMessage } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, UserCircle } from 'lucide-react';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { cn } from '@/lib/utils';
import images from '@/lib/placeholder-images.json';

// Helper to generate a simple unique ID compatible with all environments
const generateUniqueId = () => `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const AllianceChatPage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate initial messages
  useEffect(() => {
    if (playerProfile) {
      setMessages([
        {
          id: generateUniqueId(),
          senderId: 'core_system',
          senderName: 'C.O.R.E.',
          content: 'Welcome to the Alliance Strategic Comms, Commander. Coordinate with your allies here.',
          timestamp: Date.now() - 20000,
          isPlayer: false,
          senderAvatar: images.core.ai_icon
        },
        {
          id: generateUniqueId(),
          senderId: 'commander_alpha',
          senderName: 'Cmdr. Alpha',
          content: 'Glad to be here. Let\'s push for the next objective!',
          timestamp: Date.now() - 10000,
          isPlayer: false,
          senderAvatar: images.commanders.male_portrait
        },
      ]);
    }
  }, [playerProfile]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !playerProfile) return;

    const messageToSend: ChatMessage = {
      id: generateUniqueId(),
      senderId: playerProfile.id,
      senderName: playerProfile.name,
      senderCommanderSex: playerProfile.commanderSex,
      content: newMessage.trim(),
      timestamp: Date.now(),
      isPlayer: true,
    };
    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

  const getAvatarSrc = (msg: ChatMessage) => {
    if (msg.isPlayer) {
        return playerProfile.commanderSex === 'male' ? images.commanders.male_portrait : images.commanders.female_portrait;
    }
    return msg.senderAvatar || images.generic.default_avatar;
  }
   const getAvatarHint = (msg: ChatMessage) => {
    if (msg.isPlayer && playerProfile) { 
        return playerProfile.commanderSex === 'male' ? "male commander" : "female commander";
    }
     if (msg.senderId === 'core_system') return "ai hexagon";
    return "male commander";
  }


  return (
    <>
      {/* Use h-full to take available space from AppLayout's main content area */}
      <div className="flex flex-col h-full"> 
        <header className="p-3 sm:p-4 border-b border-border">
          <h1 className="text-xl sm:text-2xl font-headline text-primary">Alliance Chat</h1>
          <p className="text-sm text-muted-foreground">Coordinate with your fellow Commanders.</p>
        </header>

        <ScrollArea className="flex-grow p-2 sm:p-4" ref={scrollAreaRef}> {/* Reduced padding on mobile */}
          <div className="space-y-3 sm:space-y-4"> {/* Reduced spacing on mobile */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[75%]", // Adjusted gap and max-width
                  msg.isPlayer ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-primary/50"> {/* Reduced avatar size on mobile */}
                  <AvatarImage src={getAvatarSrc(msg)} alt={msg.senderName} data-ai-hint={getAvatarHint(msg)} />
                  <AvatarFallback>
                    {msg.senderName ? msg.senderName.substring(0, 1).toUpperCase() : <UserCircle className="h-4 w-4 sm:h-5 sm:w-5"/>}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-lg shadow", // Reduced padding on mobile
                    msg.isPlayer
                      ? "bg-primary/20 text-primary-foreground rounded-br-none"
                      : "bg-card text-card-foreground rounded-bl-none"
                  )}
                >
                  <p className="font-semibold mb-0.5 sm:mb-1"> {/* Adjusted margin */}
                    {msg.isPlayer ? "You" : msg.senderName}
                  </p>
                  <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-sm text-muted-foreground mt-1 sm:mt-1.5 text-right"> {/* Adjusted margin */}
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <footer className="p-2 sm:p-4 border-t border-border mt-auto"> {/* Reduced padding on mobile */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-input border-border focus:ring-primary h-9 sm:h-10 text-base" /* Adjusted height and text size */
              autoComplete="off"
            />
            <Button type="submit" variant="default" size="sm" aria-label="Send Message" disabled={!newMessage.trim()}> {/* Changed to size="sm" (h-9 w-9) */}
              <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5" /> {/* Adjusted icon size */}
            </Button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default AllianceChatPage;
