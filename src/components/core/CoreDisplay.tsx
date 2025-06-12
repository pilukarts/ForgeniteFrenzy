
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hexagon, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CoreMessage } from '@/lib/types';

const CoreDisplay: React.FC = () => {
  const { playerProfile, coreMessages, addCoreMessage, isCoreUnlocked } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coreMessages.length > 0 && !isOpen) {
      // Check if the latest message is newer than the last time it was opened (pseudo logic)
      // For simplicity, any new message while closed makes it unread
      setHasUnread(true);
    }
  }, [coreMessages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [coreMessages, isOpen]);

  if (!isCoreUnlocked || !playerProfile) {
    return null; // C.O.R.E. is not yet unlocked or player not loaded
  }

  const toggleCore = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false); // Mark as read when opening
    }
  };
  
  const getVoiceColor = (protocol: PlayerProfile['coreVoiceProtocol']) => {
    switch(protocol) {
        case 'male': return 'text-blue-400';
        case 'female': return 'text-pink-400';
        case 'synthetic':
        default: return 'text-teal-400';
    }
  }

  return (
    <>
      {/* C.O.R.E. floating button/icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCore}
        className={cn(
          "fixed bottom-20 right-4 z-[60] h-14 w-14 rounded-full bg-background/70 backdrop-blur-sm shadow-xl border-2 border-bright-gold core-hexagon-glow hover:bg-background",
          isOpen && "opacity-0 pointer-events-none" // Hide when panel is open
        )}
        aria-label="Toggle C.O.R.E. Interface"
      >
        <Hexagon className="h-8 w-8 text-bright-gold fill-bright-gold/20" />
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-background" />
        )}
      </Button>

      {/* C.O.R.E. Panel */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] h-[60vh] transform transition-transform duration-300 ease-in-out md:inset-x-auto md:right-4 md:bottom-4 md:h-[70vh] md:w-[380px] md:rounded-lg",
          "bg-background/80 backdrop-blur-md border-t-2 md:border-2 border-bright-gold shadow-2xl flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full md:translate-y-[calc(100%_+_1rem)]"
        )}
      >
        <div className="flex items-center justify-between p-3 border-b border-bright-gold/30">
          <div className="flex items-center gap-2">
            <Hexagon className="h-7 w-7 text-bright-gold" />
            <h3 className="font-headline text-xl text-bright-gold">C.O.R.E.</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleCore} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-grow p-3 space-y-3">
          {coreMessages.map((msg, index) => (
            <div key={index} className="mb-3 p-2.5 rounded-md bg-card/60 shadow-sm last:mb-0">
              <p className={`text-xs font-medium ${getVoiceColor(playerProfile.coreVoiceProtocol)} mb-1`}>
                C.O.R.E. [{msg.type.replace('_', ' ').toUpperCase()}]:
              </p>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className="text-xs text-muted-foreground mt-1.5 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
           {coreMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No transmissions from C.O.R.E. yet.</p>
              <p className="text-xs text-muted-foreground">Awaiting system initialization...</p>
            </div>
          )}
        </ScrollArea>
        {/* Input area for future interaction if needed */}
        {/* <div className="p-3 border-t border-bright-gold/30">
          <Input placeholder="Query C.O.R.E..." className="bg-input border-border focus:ring-bright-gold" />
        </div> */}
      </div>
    </>
  );
};

export default CoreDisplay;
