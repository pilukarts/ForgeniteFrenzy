

"use client";
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, UserCircle, Upload, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SELECTABLE_AVATARS } from '@/lib/gameData';
import { useToast } from '@/hooks/use-toast';
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
  const { playerProfile, isLoading, isInitialSetupDone, updatePlayerProfile, resetGame } = useGame();
  const [name, setName] = useState('');
  const [selectedPortraitUrl, setSelectedPortraitUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (playerProfile) {
      setName(playerProfile.name);
      // Ensure the selectedPortraitUrl is initialized correctly.
      // It should match the player's current portrait URL.
      setSelectedPortraitUrl(playerProfile.portraitUrl || SELECTABLE_AVATARS[0].portraitUrl);
    }
  }, [playerProfile]);

  const handleSave = () => {
    if (!playerProfile || !name.trim() || !selectedPortraitUrl) {
       toast({
            title: "Invalid Data",
            description: "Please ensure you have a valid callsign and selected an avatar.",
            variant: "destructive",
        });
      return;
    }
    updatePlayerProfile(name.trim(), selectedPortraitUrl);
  };


  const handleUploadClick = () => {
    toast({
        title: "Feature Not Available",
        description: "Custom avatar uploads will be enabled in a future update.",
    });
  }

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return <IntroScreen />;


  return (
    <>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 justify-items-center">
                  {SELECTABLE_AVATARS.map((avatar) => (
                  <button
                      key={avatar.portraitUrl}
                      onClick={() => setSelectedPortraitUrl(avatar.portraitUrl)}
                      className={cn(
                      "rounded-lg overflow-hidden border-2 transition-all w-32 h-32 sm:w-40 sm:h-40",
                      selectedPortraitUrl === avatar.portraitUrl ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                      )}
                  >
                      <Image src={avatar.portraitUrl} alt="Avatar" width={160} height={160} className="object-cover w-full h-auto aspect-square" data-ai-hint={avatar.hint}/>
                  </button>
                  ))}
                   <button
                    onClick={handleUploadClick}
                    className={cn(
                        "rounded-lg overflow-hidden border-2 transition-all bg-muted/30 hover:bg-muted/50 border-dashed border-muted-foreground/50 w-32 h-32 sm:w-40 sm:h-40",
                        "flex flex-col items-center justify-center aspect-square text-muted-foreground"
                        )}
                    aria-label="Upload custom avatar"
                    >
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span className="text-xs mt-1">Upload</span>
                  </button>
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
              <CardDescription>This will erase all your local progress and restart the game from the initial setup.</CardDescription>
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
                      This action cannot be undone. All your points, upgrades, and progress will be permanently deleted from this device. You will be taken back to the initial profile setup.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetGame}>Yes, Reset My Profile</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
