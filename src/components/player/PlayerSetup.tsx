"use client";
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { countries } from '@/lib/countries';
import { Check } from 'lucide-react';

const PlayerSetup: React.FC = () => {
  const { completeInitialSetup } = useGame();
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [country, setCountry] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isFormValid = name.trim() !== '' && country !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      completeInitialSetup(name.trim(), sex, country, referredBy.trim());
    }
  };

  const femaleCommanderImg = "https://i.imgur.com/BQHeVWp.png";
  const maleCommanderImg = "https://i.imgur.com/iuRJVBZ.png"; 

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-4xl bg-card text-card-foreground shadow-2xl flex flex-col sm:flex-row h-full sm:h-auto sm:max-h-[90vh]">
        
        {/* Left Column: Country List */}
        <div className="w-full sm:w-1/3 flex flex-col border-b sm:border-b-0 sm:border-r border-border">
            <div className="p-4 border-b border-border">
                <Label htmlFor="country-search" className="text-foreground/80 text-base font-semibold">Select Home Nation</Label>
                <Input 
                    id="country-search"
                    placeholder="Search nation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2 bg-input border-border focus:ring-primary"
                />
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-2">
                    {filteredCountries.length > 0 ? filteredCountries.map(c => (
                        <Button
                            key={c.code}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-left h-auto py-2 px-3",
                                country === c.code && "bg-primary/10 text-primary"
                            )}
                            onClick={() => setCountry(c.code)}
                        >
                            {country === c.code && <Check className="mr-2 h-4 w-4" />}
                            <span>{c.name}</span>
                        </Button>
                    )) : (
                        <p className="p-4 text-center text-sm text-muted-foreground">No nations found.</p>
                    )}
                </div>
            </ScrollArea>
        </div>

        {/* Right Column: Profile Details */}
        <div className="w-full sm:w-2/3 flex flex-col">
          <ScrollArea className="flex-grow">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl text-primary">Command Profile</CardTitle>
              <CardDescription className="text-muted-foreground">
                Finalize your details to begin the mission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
                {/* Commander Selection */}
                <div className="space-y-3 text-center">
                  <Label className="text-foreground/80 text-base font-semibold">Select Commander Portrait</Label>
                  <div className="flex justify-center gap-4">
                    <div 
                      className={cn(
                        "rounded-lg p-2 border-2 cursor-pointer transition-all",
                        sex === 'female' ? 'border-primary bg-primary/10' : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                      onClick={() => setSex('female')}
                    >
                      <Image src={femaleCommanderImg} alt="Female Commander" width={120} height={120} className="rounded-md object-contain" data-ai-hint="female soldier"/>
                      <p className={cn("text-sm font-medium mt-1", sex === 'female' ? 'text-primary' : 'text-muted-foreground')}>Female</p>
                    </div>
                    <div 
                      className={cn(
                        "rounded-lg p-2 border-2 cursor-pointer transition-all",
                        sex === 'male' ? 'border-primary bg-primary/10' : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                      onClick={() => setSex('male')}
                    >
                      <Image src={maleCommanderImg} alt="Male Commander" width={120} height={120} className="rounded-md object-contain" data-ai-hint="male soldier"/>
                      <p className={cn("text-sm font-medium mt-1", sex === 'male' ? 'text-primary' : 'text-muted-foreground')}>Male</p>
                    </div>
                  </div>
                </div>

                {/* Callsign */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80 text-base">Enter Callsign</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Commander Name" 
                    required 
                    className="bg-input border-border focus:ring-primary"
                  />
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <Label htmlFor="referredBy" className="text-foreground/80 text-base">Referral Code (Optional)</Label>
                  <Input 
                    id="referredBy" 
                    value={referredBy} 
                    onChange={(e) => setReferredBy(e.target.value)} 
                    placeholder="Enter referral code" 
                    className="bg-input border-border focus:ring-primary"
                  />
                </div>
            </CardContent>
          </ScrollArea>
          <CardFooter className="flex-col flex-shrink-0 mt-auto pt-6 p-4 border-t border-border">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg"
                disabled={!isFormValid}
              >
                Engage Protocol
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-2">
                The fate of humanity is in your hands.
              </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default PlayerSetup;
