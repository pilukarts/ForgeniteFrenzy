

"use client";
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, UserCircle, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ALL_AVATARS } from '@/lib/gameData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const ProfilePage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, updatePlayerProfile } = useGame();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    if (playerProfile) {
      setName(playerProfile.name);
      setSelectedAvatar(playerProfile.avatarUrl || ALL_AVATARS[0].url);
    }
  }, [playerProfile]);

  const handleSave = () => {
    if (playerProfile) {
      // Find the selected avatar object to determine the sex
      const avatarData = ALL_AVATARS.find(a => a.url === selectedAvatar) || ALL_AVATARS[0];
      updatePlayerProfile(name, selectedAvatar, avatarData.sex);
    }
  };

  const handleResetProfile = () => {
    localStorage.removeItem('playerProfile');
    localStorage.removeItem('coreMessages');
    window.location.reload();
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return <IntroScreen />;

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center">
            <UserCircle className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Commander Profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Customize your callsign and appearance.
          </p>
        </header>

        <div className="max-w-xl mx-auto space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Edit Callsign</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Callsign</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-base h-11"
                />
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Select Avatar</CardTitle>
                <CardDescription>Choose an avatar that matches your style.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {ALL_AVATARS.map((avatar) => (
                  <button
                      key={avatar.url}
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={cn(
                      "rounded-lg overflow-hidden border-2 transition-all",
                      selectedAvatar === avatar.url ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                      )}
                  >
                      <Image src={avatar.url} alt="Avatar" width={100} height={100} className="object-cover w-full h-auto aspect-square" data-ai-hint={avatar.hint}/>
                  </button>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={handleSave} className="w-full text-lg h-12" disabled={!name}>
              <Check className="mr-2 h-5 w-5"/>
              Save All Changes
          </Button>

           <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2"/> Danger Zone</CardTitle>
              <CardDescription>This will erase all your local progress and restart the game.</CardDescription>
            </CardHeader>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">Reset Profile</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your points, upgrades, and progress will be permanently deleted from this device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetProfile}>Yes, Reset Profile</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
