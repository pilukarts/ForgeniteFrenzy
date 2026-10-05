
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import IntroScreen from '../intro/IntroScreen';
import { SELECTABLE_AVATARS } from '@/lib/gameData';
import images from '@/lib/images';


const PlayerSetup: React.FC = () => {
  const { playerProfile, completeInitialSetup } = useGame();
  const [name, setName] = useState('');
  const [selectedCommanderSex, setSelectedCommanderSex] = useState<'male' | 'female'>(SELECTABLE_AVATARS[0].sex);
  const [country, setCountry] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [isCountryPopoverOpen, setCountryPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isFormValid = name.trim() !== '' && country !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      completeInitialSetup(name.trim(), selectedCommanderSex, country, referredBy.trim());
    }
  };

  if (playerProfile !== null && playerProfile.name !== '') {
    // This component shouldn't be rendered if a profile is already set up.
    // It will be unmounted by the parent component's logic.
    // We can show a loader or nothing as a fallback.
    return <IntroScreen />;
  }

  const selectedCountryName = countries.find(c => c.code === country)?.name || 'Select your home nation...';
  const filteredCountries = searchTerm === ""
    ? countries
    : countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#02030b] p-3 sm:p-5">
      <div className="absolute inset-0 scale-105 bg-cover bg-center opacity-65" style={{ backgroundImage: `url('${images.global.main_scene}')` }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(34,211,238,.08),rgba(2,3,11,.94)_80%)]" />
      <Card className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden border-cyan-300/30 bg-slate-950/75 text-white shadow-[0_0_55px_rgba(34,211,238,.18)] backdrop-blur-xl sm:h-auto sm:max-h-[94vh]">

        <CardHeader className="text-center pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[.4em] text-cyan-300">ARK Recruitment Chamber</p>
          <CardTitle className="font-headline text-3xl text-white sm:text-4xl">Choose Your Commander</CardTitle>
          <CardDescription className="pt-1 text-base text-slate-300">
            Select your MISSION: VANGUARD officer and initialize a command profile.
          </CardDescription>
        </CardHeader>

        <ScrollArea className="flex-grow">
          <CardContent className="space-y-6 p-6">
              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label className="block text-center text-lg font-semibold text-cyan-100">Commander Candidates</Label>
                <div className="flex justify-center gap-3 sm:gap-6">
                  {SELECTABLE_AVATARS.map((avatar) => (
                    <div
                      key={avatar.sex}
                      className={cn(
                        "group relative h-56 w-36 cursor-pointer overflow-hidden rounded-2xl border-2 bg-gradient-to-b from-cyan-950/40 to-slate-950/85 p-1 transition-all duration-300 sm:h-72 sm:w-48",
                        selectedCommanderSex === avatar.sex ? 'scale-[1.03] border-amber-300 shadow-[0_0_35px_rgba(251,191,36,.25)]' : 'border-cyan-300/20 opacity-70 hover:border-cyan-200/60 hover:opacity-100'
                      )}
                      onClick={() => setSelectedCommanderSex(avatar.sex)}
                    >
                      <span className="absolute inset-x-3 bottom-2 h-5 rounded-[50%] bg-cyan-300/15 blur-md" />
                      <Image src={avatar.fullBodyUrl} alt={`${avatar.sex} commander`} fill unoptimized className="object-contain object-bottom drop-shadow-[0_12px_10px_rgba(0,0,0,.75)]" data-ai-hint={avatar.hint}/>
                      <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 py-2 text-center text-xs font-black uppercase tracking-[.22em] text-cyan-100">{avatar.sex} commander</span>
                    </div>
                  ))}
                </div>
              </div>


              {/* Callsign and Nation */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base text-cyan-100">Enter Callsign</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Commander Viper"
                    required
                    className="h-11 border-cyan-300/25 bg-slate-950/70 text-base focus:ring-cyan-300"
                  />
                </div>

                 <div className="space-y-2">
                  <Label className="text-base text-cyan-100">Select Nation</Label>
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
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[200]">
                      <Command>
                        <CommandInput
                          placeholder="Search nation..."
                          onValueChange={setSearchTerm}
                        />
                        <CommandEmpty>No nation found.</CommandEmpty>
                        <CommandList>
                            <ScrollArea className="h-64">
                              {filteredCountries.map((c) => (
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
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="referredBy" className="text-base text-cyan-100">Referral Code (Optional)</Label>
                  <Input
                    id="referredBy"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    placeholder="Enter friend's code"
                    className="h-11 border-cyan-300/25 bg-slate-950/70 text-base focus:ring-cyan-300"
                  />
                </div>
              </div>
          </CardContent>
        </ScrollArea>
        <CardFooter className="mt-auto flex-shrink-0 flex-col border-t border-cyan-300/20 bg-slate-950/70 p-5">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-3 text-lg font-black uppercase tracking-[.18em] text-white shadow-[0_0_25px_rgba(34,211,238,.25)] hover:from-cyan-400 hover:to-violet-500"
              disabled={!isFormValid}
            >
              Engage Protocol
            </Button>
            <p className="mt-3 text-center text-xs text-slate-400">
              The fate of humanity is in your hands, Commander.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlayerSetup;
