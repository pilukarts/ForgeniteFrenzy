"use client";
import Link from 'next/link';
import { Home, ChevronsUp, Trophy, Users, ShoppingCart, MessagesSquare, ListChecks, Swords, Map, Gamepad2, FileText, UserCircle, GalleryHorizontal, LifeBuoy, Info, Replace, Music, Music2, RefreshCw, Globe, Share2, Send, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '../ui/button';

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upgrades', label: 'Upgrades', icon: ChevronsUp },
  { href: '/quests', label: 'Quests', icon: ListChecks },
  { href: '/battle-pass', label: 'Pass', icon: Swords },
  { href: '/level-map', label: 'Map', icon: Map },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart },
  { href: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { href: '/alliance-chat', label: 'Vanguard', icon: MessagesSquare },
];

const secondaryNavItems = [
  { href: '/nfts', label: 'NFTs', icon: GalleryHorizontal },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/legal/smart-contracts', label: 'Contracts', icon: FileText },
];

const socialLinks = [
    { href: 'https://pilukarts.github.io/', label: 'Pilukarts', icon: Globe },
    { href: 'https://t.me/FrenzyForge_bot', label: 'Telegram Game', icon: Bot },
];

const NavLink: React.FC<{ href: string; label: string; icon: React.ElementType; isExternal?: boolean }> = ({ href, label, icon: Icon, isExternal }) => {
    const pathname = usePathname();
    const isActive = !isExternal && (href === '/' ? pathname === href : pathname.startsWith(href));
     const isArcadeActive = (href === '/arcade' && (pathname.startsWith('/arcade') || pathname.startsWith('/minigame')));
     const finalIsActive = isArcadeActive || (!isArcadeActive && isActive);

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        target={isExternal ? "_blank" : "_self"}
                        rel={isExternal ? "noopener noreferrer" : ""}
                        className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-lg transition-colors",
                          finalIsActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Icon className={cn("h-6 w-6", Icon === socialLinks.find(sl => sl.label === 'X (Twitter)')?.icon ? "h-4 w-4 fill-current" : "")} />
                        <span className="sr-only">{label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const SidebarNav: React.FC = () => {
  const { toggleCommander, toggleMusic, isMusicPlaying, resetGame } = useGame();
  
  return (
    <nav className="hidden md:flex flex-col items-center gap-4 p-2 bg-background/80 border-r border-border/50">
        <div className="flex flex-col gap-2">
            {mainNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
        </div>
        <div className="my-2 h-px w-full bg-border" />
        <div className="flex flex-col gap-2">
            {secondaryNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
        </div>
        <div className="flex-grow" />
        <div className="flex flex-col gap-2">
            {socialLinks.map((item) => (
                <NavLink key={item.href} {...item} isExternal />
            ))}
        </div>
    </nav>
  );
};

export default SidebarNav;
