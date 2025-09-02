
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';

// --- Game Constants & Types ---
const BUBBLE_RADIUS = 16;
const ROWS = 14;
const COLS = 11;
const BOARD_WIDTH = COLS * BUBBLE_RADIUS * 2;
const BOARD_HEIGHT = ROWS * BUBBLE_RADIUS * 1.732; // Using hexagon packing height
const SHOOTER_Y = BOARD_HEIGHT + BUBBLE_RADIUS * 2;

const COLORS = ['#FF5A5A', '#FFD700', '#5AFF5A', '#5A5AFF', '#FF5AE4', '#5AFFFF'];

type Bubble = {
  id: number;
  x: number;
  y: number;
  color: string;
  isStatic: boolean;
};

type Projectile = Bubble & {
  vx: number;
  vy: number;
};

const GemstoneBurst: React.FC = () => {
  const { addPoints } = useGame();
  const { toast } = useToast();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [nextBubbleColor, setNextBubbleColor] = useState<string>(COLORS[0]);
  const [shooterAngle, setShooterAngle] = useState(0); // Angle in degrees
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState<false | 'WIN' | 'LOSE'>(false);
  const gameLoopRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let bubbleIdCounter = 0;

  const getBubbleColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  const resetGame = useCallback(() => {
    bubbleIdCounter = 0;
    const initialBubbles: Bubble[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < (row % 2 === 0 ? COLS : COLS - 1); col++) {
        const x = col * BUBBLE_RADIUS * 2 + (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
        const y = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
        initialBubbles.push({ id: bubbleIdCounter++, x, y, color: getBubbleColor(), isStatic: true });
      }
    }
    setBubbles(initialBubbles);
    setProjectile(null);
    setNextBubbleColor(getBubbleColor());
    setScore(0);
    setGameOver(false);
    setShooterAngle(0);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bubbles
    bubbles.forEach(bubble => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.stroke();
    });

    // Draw projectile
    if (projectile) {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = projectile.color;
      ctx.fill();
    }

    // Draw shooter base
    const shooterX = BOARD_WIDTH / 2;
    ctx.beginPath();
    ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#4A4A4A';
    ctx.fill();
    
    // Draw current bubble in shooter
     ctx.beginPath();
     ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS, 0, Math.PI * 2);
     ctx.fillStyle = projectile ? 'transparent' : nextBubbleColor;
     ctx.fill();


    // Draw shooter barrel
    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    const barrelLength = BUBBLE_RADIUS * 2.5;
    const endX = shooterX + barrelLength * Math.cos(angleRad);
    const endY = SHOOTER_Y + barrelLength * Math.sin(angleRad);
    ctx.beginPath();
    ctx.moveTo(shooterX, SHOOTER_Y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.lineWidth = 1;


  }, [bubbles, projectile, nextBubbleColor, shooterAngle]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(draw);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [draw]);

  const shoot = () => {
    if (projectile || gameOver) return;
    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    setProjectile({
      id: bubbleIdCounter++,
      x: BOARD_WIDTH / 2,
      y: SHOOTER_Y,
      color: nextBubbleColor,
      isStatic: false,
      vx: Math.cos(angleRad) * 15,
      vy: Math.sin(angleRad) * 15
    });
    setNextBubbleColor(getBubbleColor());
  };

  const handleAngleChange = (direction: 'left' | 'right') => {
      setShooterAngle(prev => {
          let newAngle = prev + (direction === 'left' ? -5 : 5);
          return Math.max(-80, Math.min(80, newAngle));
      });
  }

  const findMatches = (startBubble: Bubble, existingBubbles: Bubble[]): Bubble[] => {
    const toCheck = [startBubble];
    const matched = [startBubble];
    const checked: {[key:number]: boolean} = {[startBubble.id]: true};

    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      existingBubbles.forEach(neighbor => {
        if (!checked[neighbor.id]) {
          const dist = Math.hypot(current.x - neighbor.x, current.y - neighbor.y);
          if (dist < BUBBLE_RADIUS * 2.2 && current.color === neighbor.color) {
            toCheck.push(neighbor);
            matched.push(neighbor);
            checked[neighbor.id] = true;
          }
        }
      });
    }
    return matched;
  };

  const findFloating = (existingBubbles: Bubble[]): Bubble[] => {
        const ceilingBubbles = new Set<Bubble>();
        const toCheck: Bubble[] = [];

        existingBubbles.forEach(b => {
            if (b.y - BUBBLE_RADIUS <= 0) {
                ceilingBubbles.add(b);
                toCheck.push(b);
            }
        });

        const checked = new Set(ceilingBubbles.map(b => b.id));

        while (toCheck.length > 0) {
            const current = toCheck.pop()!;
            existingBubbles.forEach(neighbor => {
                if (!checked.has(neighbor.id)) {
                    const dist = Math.hypot(current.x - neighbor.x, current.y - neighbor.y);
                    if (dist < BUBBLE_RADIUS * 2.2) {
                        checked.add(neighbor.id);
                        toCheck.push(neighbor);
                    }
                }
            });
        }
        
        return existingBubbles.filter(b => !checked.has(b.id));
    };

  // Main game logic in useEffect
  useEffect(() => {
    const handleProjectile = () => {
      if (!projectile) return;

      let newProjectile = { ...projectile, x: projectile.x + projectile.vx, y: projectile.y + projectile.vy };

      // Wall collision
      if (newProjectile.x - BUBBLE_RADIUS < 0 || newProjectile.x + BUBBLE_RADIUS > BOARD_WIDTH) {
        newProjectile.vx *= -1;
      }
      
      // Ceiling collision
       if (newProjectile.y - BUBBLE_RADIUS < 0) {
          newProjectile.y = BUBBLE_RADIUS;
          newProjectile.isStatic = true;
          handleBubbleCollision(newProjectile);
          return;
       }


      // Bubble collision
      for (const bubble of bubbles) {
        const dist = Math.hypot(newProjectile.x - bubble.x, newProjectile.y - bubble.y);
        if (dist < BUBBLE_RADIUS * 2) {
          newProjectile.isStatic = true;
          handleBubbleCollision(newProjectile);
          return;
        }
      }

      setProjectile(newProjectile);
    };
    
    const handleBubbleCollision = (collidedBubble: Projectile) => {
        setProjectile(null);
        
        let newBubbles = [...bubbles, { ...collidedBubble, isStatic: true }];
        const matches = findMatches(collidedBubble, newBubbles);

        if (matches.length >= 3) {
            const matchIds = new Set(matches.map(b => b.id));
            newBubbles = newBubbles.filter(b => !matchIds.has(b.id));
            const pointsEarned = matches.length * 10;

            const floating = findFloating(newBubbles);
            if (floating.length > 0) {
                 const floatingIds = new Set(floating.map(b => b.id));
                 newBubbles = newBubbles.filter(b => !floatingIds.has(b.id));
                 const dropPoints = floating.length * 20;
                 addPoints(dropPoints);
                 setScore(s => s + dropPoints);
                 toast({title: 'Nice Drop!', description: `+${dropPoints} bonus points!`});
            }

            addPoints(pointsEarned);
            setScore(s => s + pointsEarned);
        }

        setBubbles(newBubbles);

        // Check for win/loss
        if (newBubbles.length === 0) {
          setGameOver('WIN');
          toast({ title: 'You Win!', description: 'All gems cleared!' });
          addPoints(5000);
          setScore(s => s + 5000);
        } else if (newBubbles.some(b => b.y + BUBBLE_RADIUS > SHOOTER_Y - BUBBLE_RADIUS * 2)) {
          setGameOver('LOSE');
          toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
        }
    };


    const gameInterval = setInterval(handleProjectile, 1000 / 60); // 60 FPS
    return () => clearInterval(gameInterval);
  }, [projectile, bubbles, addPoints, toast]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-headline text-primary">Score: {score}</div>
      <div className="relative bg-card rounded-lg border-2 border-primary shadow-lg" style={{width: BOARD_WIDTH, height: BOARD_HEIGHT + 60}}>
         <AnimatePresence>
            {gameOver && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20"
                >
                <p className="text-4xl font-headline text-primary mb-2">{gameOver === 'LOSE' ? 'Game Over' : 'You Win!'}</p>
                <Button onClick={resetGame} variant="secondary">Play Again</Button>
                </motion.div>
            )}
            </AnimatePresence>
        <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT + 60} onClick={shoot} className="cursor-pointer z-10" />
      </div>
       <div className="flex items-center gap-4 mt-2">
            <Button onClick={() => handleAngleChange('left')} variant="outline" size="icon" className="h-12 w-12"><ArrowLeft /></Button>
            <Button onClick={shoot} className="h-16 w-24 text-lg font-bold">Shoot</Button>
            <Button onClick={() => handleAngleChange('right')} variant="outline" size="icon" className="h-12 w-12"><ArrowRight /></Button>
       </div>
       <Button onClick={resetGame} variant="ghost" size="sm" className="mt-2"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
    </div>
  );
};

export default GemstoneBurst;
