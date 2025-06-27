"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PreIntroScreenProps {
  onCompletion: () => void;
}

const PreIntroScreen: React.FC<PreIntroScreenProps> = ({ onCompletion }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/80 p-4"
    >
        <Card className="w-full max-w-md bg-card text-card-foreground shadow-2xl animate-fade-in-slow">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Image src="https://placehold.co/100x100.png?text=AF" alt="Alliance Forge Logo" width={80} height={80} className="rounded-full" data-ai-hint="logo emblem" />
            </div>
            <CardTitle className="text-center font-headline text-3xl text-primary">Mission Briefing</CardTitle>
            <CardDescription className="text-center text-muted-foreground pt-2 text-base">
              Humanity's fate rests on your shoulders, Commander. The Cyber Concord approaches. We must evacuate Earth. Prepare your command profile.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col">
            <Button 
              onClick={onCompletion}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg"
            >
              Proceed to Profile Setup
            </Button>
            <p className="text-sm text-muted-foreground text-center mt-4">
              By proceeding, you accept the mission parameters.
            </p>
          </CardFooter>
        </Card>
        <style jsx global>{`
            @keyframes fade-in-slow {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-slow {
              animation: fade-in-slow 1s ease-out forwards;
            }
        `}</style>
    </motion.div>
  );
};

export default PreIntroScreen;
