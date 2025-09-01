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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';


const PlayerSetup: React.FC = () => {
  const { completeInitialSetup } = useGame();
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [country, setCountry] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [isCountrySelectorOpen, setCountrySelectorOpen] = useState(false);

  const isFormValid = name.trim() !== '' && country !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      completeInitialSetup(name.trim(), sex, country, referredBy.trim());
    }
  };

  const femaleCommanderImg = "https://i.imgur.com/BQHeVWp.png";
  const maleCommanderImg = "https://i.imgur.com/iuRJVBZ.png"; 

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-2xl flex flex-col h-full sm:h-auto">
        <CardHeader>
          <CardTitle className="text-center font-headline text-3xl text-primary">Command Profile</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Finalize your details to begin the mission.
          </CardDescription>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="space-y-6 p-4">
              {/* Commander Selection */}
              <div className="space-y-3 text-center">
                <Label className="text-foreground/80 text-base font-semibold">Select Commander Portrait</Label>
                <div className="flex justify-center gap-4">
                  {/* Female Commander */}
                  <div 
                    className={cn(
                      "rounded-lg p-2 border-2 cursor-pointer transition-all",
                      sex === 'female' ? 'border-primary bg-primary/10' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    onClick={() => setSex('female')}
                  >
                    <Image src={femaleCommanderImg} alt="Female Commander" width={120} height={120} className="rounded-md object-contain" data-ai-hint="female soldier" />
                    <p className={cn("text-sm font-medium mt-1", sex === 'female' ? 'text-primary' : 'text-muted-foreground')}>Female</p>
                  </div>
                  {/* Male Commander */}
                  <div 
                    className={cn(
                      "rounded-lg p-2 border-2 cursor-pointer transition-all",
                      sex === 'male' ? 'border-primary bg-primary/10' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    onClick={() => setSex('male')}
                  >
                    <Image src={maleCommanderImg} alt="Male Commander" width={120} height={120} className="rounded-md object-contain" data-ai-hint="male soldier" />
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

               {/* Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-foreground/80 text-base">Select Home Nation</Label>
                 <Popover open={isCountrySelectorOpen} onOpenChange={setCountrySelectorOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isCountrySelectorOpen}
                        className="w-full justify-between bg-input border-border hover:bg-input/80"
                      >
                        {country
                          ? countries.find((c) => c.code === country)?.name
                          : "Select your nation..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search nation..." />
                        <CommandList>
                            <CommandEmpty>No nation found.</CommandEmpty>
                             <ScrollArea className="h-48">
                                <CommandGroup>
                                {countries.map((c) => (
                                    <CommandItem
                                    key={c.code}
                                    value={c.name}
                                    onSelect={() => {
                                        setCountry(c.code);
                                        setCountrySelectorOpen(false);
                                    }}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        country === c.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {c.name}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </ScrollArea>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
        <CardFooter className="flex-col flex-shrink-0 mt-auto pt-6 border-t border-border">
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
      </Card>
    </div>
  );
};

export default PlayerSetup;
