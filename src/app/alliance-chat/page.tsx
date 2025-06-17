
"use client";
import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
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
          id: crypto.randomUUID(),
          senderId: 'core_system',
          senderName: 'C.O.R.E.',
          content: 'Welcome to the Alliance Strategic Comms, Commander. Coordinate with your allies here.',
          timestamp: Date.now() - 20000,
          isPlayer: false,
          senderAvatar: 'https://placehold.co/40x40.png?text=CORE'
        },
        {
          id: crypto.randomUUID(),
          senderId: 'commander_alpha',
          senderName: 'Cmdr. Alpha',
          content: 'Glad to be here. Let\'s push for the next objective!',
          timestamp: Date.now() - 10000,
          isPlayer: false,
          senderAvatar: 'https://placehold.co/40x40.png?text=CA'
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
      id: crypto.randomUUID(),
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
        return playerProfile.commanderSex === 'male' ? "https://placehold.co/40x40.png" : "https://placehold.co/40x40.png";
    }
    return msg.senderAvatar || "https://placehold.co/40x40.png";
  }
   const getAvatarHint = (msg: ChatMessage) => {
    if (msg.isPlayer) {
        return playerProfile.commanderSex === 'male' ? "male commander" : "female commander";
    }
    return "avatar placeholder";
  }


  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-160px)] pb-16"> {/* Adjust height for header and bottom nav */}
        <header className="p-4 border-b border-border">
          <h1 className="text-2xl font-headline text-primary">Alliance Chat</h1>
          <p className="text-sm text-muted-foreground">Coordinate with your fellow Commanders.</p>
        </header>

        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 max-w-[85%] sm:max-w-[75%]",
                  msg.isPlayer ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <Avatar className="h-8 w-8 border border-primary/50">
                  <AvatarImage src={getAvatarSrc(msg)} alt={msg.senderName} data-ai-hint={getAvatarHint(msg)} />
                  <AvatarFallback>
                    {msg.senderName?.substring(0, 1).toUpperCase() || <UserCircle size={16}/>}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "p-3 rounded-lg shadow",
                    msg.isPlayer
                      ? "bg-primary/20 text-primary-foreground rounded-br-none"
                      : "bg-card text-card-foreground rounded-bl-none"
                  )}
                >
                  <p className="text-xs font-semibold mb-1">
                    {msg.isPlayer ? "You" : msg.senderName}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <footer className="p-4 border-t border-border mt-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-input border-border focus:ring-primary"
              autoComplete="off"
            />
            <Button type="submit" variant="default" size="icon" aria-label="Send Message" disabled={!newMessage.trim()}>
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </form>
        </footer>
      </div>
    </AppLayout>
  );
};

export default AllianceChatPage;
