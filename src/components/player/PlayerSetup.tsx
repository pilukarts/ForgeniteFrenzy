
"use client";
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PlayerSetup: React.FC = () => {
  const { completeInitialSetup } = useGame();
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [country, setCountry] = useState(COUNTRIES[0].code);

  const isFormValid = name.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && country) {
      completeInitialSetup(name.trim(), sex, country);
    }
  };

  const femaleCommanderImg = "https://i.imgur.com/BQHeVWp.png";
  const maleCommanderImg = "https://i.imgur.com/zBtG9vy.png";


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="https://placehold.co/100x100.png?text=AF" alt="Alliance Forge Logo" width={80} height={80} className="rounded-full" data-ai-hint="logo emblem" />
          </div>
          <CardTitle className="text-center font-headline text-3xl text-primary">Mission Briefing</CardTitle>
          <CardDescription className="text-center text-muted-foreground pt-2">
            Humanity's fate rests on your shoulders, Commander. The Cyber Concord approaches. We must evacuate Earth. Prepare your command profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Enter Callsign</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Commander Name" 
                required 
                className="bg-input border-border focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground/80">Select Commander Portrait</Label>
              <RadioGroup defaultValue="female" onValueChange={(value) => setSex(value as 'male' | 'female')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" className="text-primary focus:ring-primary data-[state=checked]:bg-primary"/>
                  <Label htmlFor="female" className="cursor-pointer">
                    <Image src={femaleCommanderImg} alt="Female Commander" width={60} height={60} className={cn("rounded-md border-2 object-contain", sex === 'female' ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100')} data-ai-hint="female soldier" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" className="text-primary focus:ring-primary data-[state=checked]:bg-primary"/>
                  <Label htmlFor="male" className="cursor-pointer">
                    <Image src={maleCommanderImg} alt="Male Commander" width={60} height={60} className={cn("rounded-md border-2 object-contain", sex === 'male' ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100')} data-ai-hint="male soldier" />
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-foreground/80">Select Region</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country" className="w-full bg-input border-border focus:ring-primary">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.code} className="focus:bg-primary/20">
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg"
              disabled={!isFormValid}
            >
              Engage Protocol
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block">
          By engaging, you accept the mission parameters. The fate of humanity is in your hands.
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlayerSetup;

    