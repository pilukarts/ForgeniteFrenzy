
"use client";
import React from 'react';
import Image from 'next/image';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import images from '@/lib/placeholder-images.json';

const CoreDisplay: React.FC = () => {
  const { playerProfile, coreMessages, isCoreUnlocked, askCore, isOpen, setIsOpen, hasUnread, setHasUnread } = useGame();
  const [question, setQuestion] = React.useState('');
  const [isAsking, setIsAsking] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coreMessages, isOpen]);

  if (!isCoreUnlocked || !playerProfile) return null;

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;
    setIsAsking(true);
    const q = question;
    setQuestion('');
    await askCore(q);
    setIsAsking(false);
  };

  const currentTierColor = playerProfile.currentTierColor || '210 15% 75%';

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        className={cn(
          "fixed bottom-20 right-4 z-[60] h-14 w-14 rounded-full bg-black/50 backdrop-blur-md core-hexagon-glow border border-primary/40",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <Image src={images.core.ai_icon} alt="C.O.R.E." width={38} height={38} unoptimized data-ai-hint="ai icon" />
        {hasUnread && !isOpen && <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-accent ring-2 ring-background" />}
      </Button>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] h-[65vh] transform transition-transform duration-300 md:right-4 md:bottom-4 md:w-[400px] md:rounded-xl",
          "bg-gray-950/95 backdrop-blur-2xl border-t-2 border-primary/50 md:border-2 shadow-2xl flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
             <Image src={images.core.ai_icon} alt="CORE" width={32} height={32} unoptimized />
             <h3 className="font-headline text-xl text-primary tracking-widest">C.O.R.E.</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-5 w-5" /></Button>
        </div>

        <ScrollArea className="flex-grow p-4">
          {coreMessages.map((msg, i) => (
            <div key={i} className={cn("mb-4 p-3 rounded-lg border", msg.type === 'question' ? 'bg-primary/5 border-primary/20 ml-6' : 'bg-white/5 border-white/10 mr-6')}>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                {msg.type === 'question' ? 'Commander' : 'C.O.R.E.'}
              </p>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <form onSubmit={handleAskQuestion} className="p-4 border-t border-white/10 flex gap-2">
            <Input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Tactical inquiry..." className="bg-white/5 border-white/20" disabled={isAsking} />
            <Button type="submit" size="icon" disabled={!question.trim() || isAsking}><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </>
  );
};

export default CoreDisplay;
