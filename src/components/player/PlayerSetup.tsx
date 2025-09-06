
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
import { Check, Search, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import IntroScreen from '../intro/IntroScreen';
import { ALL_AVATARS } from '@/lib/gameData';


const PlayerSetup: React.FC = () => {
  const { playerProfile, completeInitialSetup } = useGame();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(ALL_AVATARS[0]);
  const [country, setCountry] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [isCountryPopoverOpen, setCountryPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isFormValid = name.trim() !== '' && country !== '' && selectedAvatar.url !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      completeInitialSetup(name.trim(), selectedAvatar.sex, selectedAvatar.url, country, referredBy.trim());
    }
  };
  
  if (!playerProfile) {
    return <IntroScreen />;
  }
  
  const selectedCountryName = countries.find(c => c.code === country)?.name || 'Select your home nation...';
  const filteredCountries = searchTerm === ""
    ? countries
    : countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-lg bg-card text-card-foreground shadow-2xl flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
        
        <CardHeader className="text-center pt-6">
          <CardTitle className="font-headline text-3xl text-primary">Command Profile</CardTitle>
          <CardDescription className="text-muted-foreground text-base pt-1">
            Finalize your details to begin the mission.
          </CardDescription>
        </CardHeader>
        
        <ScrollArea className="flex-grow">
          <CardContent className="space-y-6 p-6">
              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label className="text-foreground/80 text-lg font-semibold block text-center">Select Your Commander</Label>
                <div className="grid grid-cols-4 gap-2">
                  {ALL_AVATARS.map((avatar) => (
                    <div 
                      key={avatar.url}
                      className={cn(
                        "rounded-lg p-1 border-2 cursor-pointer transition-all duration-300",
                        selectedAvatar.url === avatar.url ? 'border-primary bg-primary/10 shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/50'
                      )}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      <Image src={avatar.url} alt="Commander Avatar" width={100} height={100} className="rounded-md object-cover w-full h-auto aspect-square" data-ai-hint={avatar.hint}/>
                    </div>
                  ))}
                </div>
              </div>


              {/* Callsign and Nation */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80 text-base">Enter Callsign</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="E.g., Commander Viper" 
                    required 
                    className="bg-input border-border focus:ring-primary h-11 text-base"
                  />
                </div>
                
                 <div className="space-y-2">
                  <Label className="text-foreground/80 text-base">Select Nation</Label>
                   <Popover open={isCountryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isCountryPopoverOpen}
                        className="w-full justify-between h-11 text-base font-normal"
                      >
                        {selectedCountryName}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search nation..." />
                        <CommandEmpty>No nation found.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-64">
                              {countries.map((c) => (
                                <CommandItem
                                  key={c.code}
                                  value={c.name}
                                  onSelect={() => {
                                    setCountry(c.code);
                                    setCountryPopoverOpen(false);
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
                            </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="referredBy" className="text-foreground/80 text-base">Referral Code (Optional)</Label>
                  <Input 
                    id="referredBy" 
                    value={referredBy} 
                    onChange={(e) => setReferredBy(e.target.value)} 
                    placeholder="Enter friend's code" 
                    className="bg-input border-border focus:ring-primary h-11 text-base"
                  />
                </div>
              </div>
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex-col flex-shrink-0 mt-auto p-6 bg-card/50 border-t border-border">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg"
              disabled={!isFormValid}
            >
              Engage Protocol
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              The fate of humanity is in your hands, Commander.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlayerSetup;
