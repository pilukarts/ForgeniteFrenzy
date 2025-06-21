
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hexagon, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CoreMessage, PlayerProfile } from '@/lib/types'; // Import PlayerProfile

const CoreDisplay: React.FC = () => {
  const { playerProfile, coreMessages, addCoreMessage, isCoreUnlocked } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coreMessages.length > 0 && !isOpen) {
      setHasUnread(true);
    }
  }, [coreMessages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [coreMessages, isOpen]);

  if (!isCoreUnlocked || !playerProfile) {
    return null; 
  }

  const toggleCore = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false); 
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

  const currentTierColor = playerProfile.currentTierColor || '210 15% 75%'; // Default to Silver HSL
  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
  const dynamicCoreStyle = {
    '--dynamic-commander-glow': currentTierColor, // For the glow animation on button
    '--dynamic-core-color': currentTierColor,     // For direct color styling
    clipPath: hexagonClipPath,
  } as React.CSSProperties;

  return (
    <>
      {/* C.O.R.E. floating button/icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCore}
        style={dynamicCoreStyle} // Apply dynamic HSL for glow, direct color, and hexagonal shape
        className={cn(
          "fixed bottom-20 right-4 z-[60] h-14 w-14 bg-background/70 backdrop-blur-sm core-hexagon-glow", // REMOVED rounded-full and shadow-xl
          "border-2 border-[hsl(var(--dynamic-core-color))]", // Dynamic border color
          "hover:bg-background",
          isOpen && "opacity-0 pointer-events-none" 
        )}
        aria-label="Toggle C.O.R.E. Interface"
      >
        <Hexagon className={cn("h-8 w-8 text-[hsl(var(--dynamic-core-color))] fill-[hsla(var(--dynamic-core-color)/0.2)]")} /> {/* Dynamic icon colors */}
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-background" style={{ clipPath: 'none' }} />
        )}
      </Button>

      {/* C.O.R.E. Panel */}
      <div
        style={{ '--dynamic-core-color': currentTierColor } as React.CSSProperties} // Set var for children elements to use for direct coloring
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] h-[60vh] transform transition-transform duration-300 ease-in-out md:inset-x-auto md:right-4 md:bottom-4 md:h-[70vh] md:w-[380px] md:rounded-lg",
          "bg-background/80 backdrop-blur-md md:border-2 shadow-2xl flex flex-col",
          "border-t-2 border-[hsl(var(--dynamic-core-color))] md:border-[hsl(var(--dynamic-core-color))]", // Dynamic border for panel
          isOpen ? "translate-y-0" : "translate-y-full md:translate-y-[calc(100%_+_1rem)]"
        )}
      >
        <div className={cn("flex items-center justify-between p-3 border-b border-[hsla(var(--dynamic-core-color)/0.3)]")}> {/* Dynamic inner border */}
          <div className="flex items-center gap-2">
            <Hexagon className={cn("h-7 w-7 text-[hsl(var(--dynamic-core-color))]")} /> {/* Dynamic icon color */}
            <h3 className={cn("font-headline text-xl text-[hsl(var(--dynamic-core-color))]")}>C.O.R.E.</h3> {/* Dynamic text color */}
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
      </div>
    </>
  );
};

export default CoreDisplay;
