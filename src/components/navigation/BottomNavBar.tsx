
"use client";
import Link from 'next/link';
import { Home, ChevronsUp, Trophy, Users, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upgrades', label: 'Upgrades', icon: ChevronsUp },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart },
  // { href: '/alliance', label: 'Alliance', icon: Users }, // Phase 2
];

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="container mx-auto flex justify-around items-center h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center text-sm p-2 rounded-md transition-colors", // Increased text size
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
