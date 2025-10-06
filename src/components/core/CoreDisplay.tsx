
"use client";
import React from 'react';
import Image from 'next/image';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hexagon, MessageSquare, X, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CoreMessage, PlayerProfile } from '@/lib/types';
import images from '@/lib/placeholder-images.json';

const CoreDisplay: React.FC = () => {
  const { playerProfile, coreMessages, isCoreUnlocked, askCore, isOpen, setIsOpen, hasUnread, setHasUnread } = useGame();
  const [question, setQuestion] = React.useState('');
  const [isAsking, setIsAsking] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const prevCoreMessagesLength = React.useRef(coreMessages.length);

  React.useEffect(() => {
    if (coreMessages.length > prevCoreMessagesLength.current && !isOpen) {
      setHasUnread(true);
    }
    prevCoreMessagesLength.current = coreMessages.length;
  }, [coreMessages, isOpen, setHasUnread]);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [coreMessages, isOpen]);

  if (!isCoreUnlocked || !playerProfile) {
    return null; 
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;
    
    setIsAsking(true);
    const questionToAsk = question;
    setQuestion('');

    try {
      await askCore(questionToAsk);
    } catch (error) {
      console.error("Failed to get answer from C.O.R.E.", error);
    } finally {
      setIsAsking(false);
    }
  };

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

  const currentTierColor = playerProfile.currentTierColor || '210 15% 75%';
  const dynamicCoreStyle = {
    '--dynamic-commander-glow': currentTierColor,
    '--dynamic-core-color': currentTierColor,
  } as React.CSSProperties;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCore}
        style={dynamicCoreStyle}
        className={cn(
          "fixed bottom-20 right-4 z-[60] h-14 w-14 rounded-full bg-transparent core-hexagon-glow",
          "flex items-center justify-center p-2",
          "hover:bg-background/20",
          isOpen && "opacity-0 pointer-events-none"
        )}
        aria-label="Toggle C.O.R.E. Interface"
      >
        <Image src={images.ark.starforge_ark} alt="C.O.R.E." width={40} height={40} className="object-contain" data-ai-hint="colony spaceship"/>
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-background" />
        )}
      </Button>

      <div
        style={{ '--dynamic-core-color': currentTierColor } as React.CSSProperties}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] h-[60vh] transform transition-transform duration-300 ease-in-out md:inset-x-auto md:right-4 md:bottom-4 md:h-[70vh] md:w-[380px] md:rounded-lg",
          "bg-background/80 backdrop-blur-md md:border-2 shadow-2xl flex flex-col",
          "border-t-2 border-[hsl(var(--dynamic-core-color))] md:border-[hsl(var(--dynamic-core-color))]",
          isOpen ? "translate-y-0" : "translate-y-full md:translate-y-[calc(100%_+_1rem)]"
        )}
      >
        <div className={cn("flex items-center justify-between p-3 border-b border-[hsla(var(--dynamic-core-color)/0.3)]")}>
          <div className="flex items-center gap-2">
            <Hexagon className={cn("h-7 w-7 text-[hsl(var(--dynamic-core-color))]")} />
            <h3 className={cn("font-headline text-xl text-[hsl(var(--dynamic-core-color))]")}>C.O.R.E.</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleCore} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-grow p-3 space-y-3">
          {coreMessages.map((msg, index) => (
            <div key={index} className={cn("mb-3 p-2.5 rounded-md shadow-sm last:mb-0", msg.type === 'question' ? 'bg-primary/10' : 'bg-card/60')}>
              <p className={cn("text-xs font-medium mb-1", msg.type === 'question' ? 'text-primary' : getVoiceColor(playerProfile.coreVoiceProtocol))}>
                 {msg.type === 'question' ? <> <User className="inline h-3 w-3 mr-1"/> Commander</> : <>C.O.R.E. [{msg.type.replace('_', ' ').toUpperCase()}]</>}:
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

        <form onSubmit={handleAskQuestion} className="p-3 border-t border-[hsla(var(--dynamic-core-color)/0.3)] flex items-center gap-2">
            <Input 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask C.O.R.E. anything..."
              className="bg-input/70 border-border/50 focus:ring-[hsl(var(--dynamic-core-color))]"
              disabled={isAsking}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={!question.trim() || isAsking}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
      </div>
    </>
  );
};

export default CoreDisplay;
