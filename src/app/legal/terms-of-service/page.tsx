
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import Link from 'next/link';


const TermsOfServicePage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary flex items-center">
            <FileText className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Rules of engagement for all Alliance Commanders.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px)-var(--page-padding,48px))]">
          <div className="space-y-6 text-sm sm:text-base text-foreground/90">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement made between you ("you" or "User") and [Your Company/Studio] ("we," "us," or "our") concerning your access to and use of the Alliance Forge game ("Game"). By accessing, playing, or registering for our Game, you agree to be bound by these Terms and our{' '}
                  <Link href="/legal/transparency-statement" className="text-primary hover:underline">
                    Transparency Statement
                  </Link>. If you do not agree with these Terms, you must not use the Game.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">2. User Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Eligibility:</strong> You must be at least 13 years old to create an account and play the Game.</p>
                <p><strong>Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and for all activities that occur under it. You agree to immediately notify us of any unauthorized use.</p>
                <p><strong>Conduct:</strong> Cheating, exploiting, using bots, hacks, or any unauthorized third-party software to modify or automate gameplay is prohibited. Violation of this rule may result in account suspension or termination.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">3. Digital Assets & Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Our IP:</strong> The Game, including all code, graphics, characters, names, and other content, is owned by us or our licensors.</p>
                <p><strong>Virtual Goods:</strong> We grant you a limited, non-exclusive, non-transferable, revocable license to use virtual goods (like Points and Auron) within the Game for gameplay purposes. They have no real-world monetary value and are not redeemable for cash.</p>
                <p><strong>Non-Fungible Tokens (NFTs):</strong> By acquiring an NFT, you own the token on the blockchain. However, the intellectual property of the associated art and traits remains with us. We grant you a license to use, display, and trade your NFT for personal, non-commercial purposes.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">4. Player Code of Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Use language or share content that is unlawful, abusive, hateful, or discriminatory.</li>
                    <li>Impersonate another player, a staff member, or any other person.</li>
                    <li>Disrupt the game or servers, or negatively affect other players' experiences.</li>
                    <li>Engage in "real money trading" (RMT) of virtual goods or accounts outside of authorized NFT marketplace platforms.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">5. Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We reserve the right to suspend or terminate your account and access to the Game, without notice, for any violation of these Terms.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">6. Disclaimers and Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>THE GAME IS PROVIDED "AS IS." WE MAKE NO WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.</p>
                <p>The value of blockchain assets (NFTs, cryptocurrencies) is volatile. We are not responsible for any financial losses.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">7. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We may modify these Terms at any time. We will notify you of significant changes. Your continued use of the Game after changes constitutes your acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">8. Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                   For questions about these Terms, please contact us through our{' '}
                   <Link href="/support" className="text-primary hover:underline">
                    support page
                  </Link>.
                </p>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
        {/* CSS variables for dynamic height calculation */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-header-h: 100px;
            --bottom-nav-h: 56px;
            --page-padding: 48px;
          }
           @media (min-width: 640px) { /* sm breakpoint */
            :root {
              --app-header-h: 68px;
              --page-header-h: 110px;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default TermsOfServicePage;
