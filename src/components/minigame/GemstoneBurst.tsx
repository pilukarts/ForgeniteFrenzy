
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

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
  row: number;
  col: number;
  color: string;
  isStatic: boolean;
};

type Projectile = Omit<Bubble, 'row' | 'col'> & {
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
  const bubbleIdCounter = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getBubbleColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  const resetGame = useCallback(() => {
    bubbleIdCounter.current = 0;
    const initialBubbles: Bubble[] = [];
    for (let row = 0; row < 5; row++) {
      const numCols = row % 2 === 0 ? COLS : COLS - 1;
      for (let col = 0; col < numCols; col++) {
        const x = col * BUBBLE_RADIUS * 2 + (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
        const y = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
        initialBubbles.push({ 
            id: bubbleIdCounter.current++, 
            x, y, row, col, 
            color: getBubbleColor(), 
            isStatic: true 
        });
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

    bubbles.forEach(bubble => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.stroke();
    });

    if (projectile) {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = projectile.color;
      ctx.fill();
    }

    const shooterX = BOARD_WIDTH / 2;
    ctx.beginPath();
    ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#4A4A4A';
    ctx.fill();
    
     ctx.beginPath();
     ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS, 0, Math.PI * 2);
     ctx.fillStyle = projectile ? 'transparent' : nextBubbleColor;
     ctx.fill();

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
  
  const shoot = useCallback(() => {
    if (projectile || gameOver) return;
    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    setProjectile({
      id: bubbleIdCounter.current++,
      x: BOARD_WIDTH / 2,
      y: SHOOTER_Y,
      color: nextBubbleColor,
      isStatic: false,
      vx: Math.cos(angleRad) * 15,
      vy: Math.sin(angleRad) * 15
    });
    setNextBubbleColor(getBubbleColor());
  }, [projectile, gameOver, shooterAngle, nextBubbleColor]);

  const handleAngleChange = (direction: 'left' | 'right') => {
      setShooterAngle(prev => {
          let newAngle = prev + (direction === 'left' ? -5 : 5);
          return Math.max(-80, Math.min(80, newAngle));
      });
  }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) return;
            switch (e.key) {
                case 'ArrowLeft': handleAngleChange('left'); break;
                case 'ArrowRight': handleAngleChange('right'); break;
                case 'ArrowUp': case ' ': shoot(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, shoot]);


  const findMatches = (startBubble: Bubble, existingBubbles: Bubble[]): Bubble[] => {
    const toCheck: Bubble[] = [startBubble];
    const matched: Bubble[] = [];
    const checked = new Set<number>();
    
    checked.add(startBubble.id);

    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      if(current.color === startBubble.color) {
        matched.push(current);
        existingBubbles.forEach(neighbor => {
          if (!checked.has(neighbor.id)) {
            const dist = Math.hypot(current.x - neighbor.x, current.y - neighbor.y);
            if (dist < BUBBLE_RADIUS * 2.2) {
              toCheck.push(neighbor);
              checked.add(neighbor.id);
            }
          }
        });
      }
    }
    return matched;
  };

  const findFloating = (existingBubbles: Bubble[]): Bubble[] => {
        const connectedBubbles = new Set<number>();
        const toCheck: Bubble[] = [];

        existingBubbles.forEach(b => {
            if (b.y - BUBBLE_RADIUS <= 0) {
                toCheck.push(b);
                connectedBubbles.add(b.id);
            }
        });
        
        let head = 0;
        while(head < toCheck.length) {
            const current = toCheck[head++];
            existingBubbles.forEach(neighbor => {
                if (!connectedBubbles.has(neighbor.id)) {
                    const dist = Math.hypot(current.x - neighbor.x, current.y - neighbor.y);
                    if (dist < BUBBLE_RADIUS * 2.2) {
                        connectedBubbles.add(neighbor.id);
                        toCheck.push(neighbor);
                    }
                }
            });
        }
        
        return existingBubbles.filter(b => !connectedBubbles.has(b.id));
    };

  useEffect(() => {
    let animationFrameId: number;

    const gameUpdate = () => {
      if (!projectile) {
        animationFrameId = requestAnimationFrame(gameUpdate);
        return;
      };

      let newProjectile: Projectile = { ...projectile, x: projectile.x + projectile.vx, y: projectile.y + projectile.vy };

      if (newProjectile.x - BUBBLE_RADIUS < 0 || newProjectile.x + BUBBLE_RADIUS > BOARD_WIDTH) {
        newProjectile.vx *= -1;
      }
      
      let collision = false;
       if (newProjectile.y - BUBBLE_RADIUS < 0) {
          newProjectile.y = BUBBLE_RADIUS;
          collision = true;
       }

      if (!collision) {
        for (const bubble of bubbles) {
          const dist = Math.hypot(newProjectile.x - bubble.x, newProjectile.y - bubble.y);
          if (dist < BUBBLE_RADIUS * 2) {
            collision = true;
            break;
          }
        }
      }

      if (collision) {
        setProjectile(null);
        
        const row = Math.round((newProjectile.y - BUBBLE_RADIUS) / (BUBBLE_RADIUS * 1.732));
        const colOffset = row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2;
        const col = Math.round((newProjectile.x - colOffset) / (BUBBLE_RADIUS * 2));

        const snapX = col * BUBBLE_RADIUS * 2 + colOffset;
        const snapY = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;

        const finalProjectile: Bubble = { 
            ...newProjectile, 
            isStatic: true, 
            x: snapX, 
            y: snapY, 
            row, 
            col 
        };

        let newBubbles = [...bubbles, finalProjectile];
        
        const matches = findMatches(finalProjectile, newBubbles);

        if (matches.length >= 3) {
            const matchIds = new Set(matches.map(b => b.id));
            newBubbles = newBubbles.filter(b => !matchIds.has(b.id));
            const pointsEarned = matches.length * 10;
            addPoints(pointsEarned);
            setScore(s => s + pointsEarned);

            const floating = findFloating(newBubbles);
            if (floating.length > 0) {
                 const floatingIds = new Set(floating.map(b => b.id));
                 newBubbles = newBubbles.filter(b => !floatingIds.has(b.id));
                 const dropPoints = floating.length * 20;
                 addPoints(dropPoints);
                 setScore(s => s + dropPoints);
                 toast({title: 'Nice Drop!', description: `+${dropPoints} bonus points!`});
            }
        }

        setBubbles(newBubbles);

        if (newBubbles.length === 0) {
          setGameOver('WIN');
          const winBonus = 5000;
          addPoints(winBonus);
          toast({ title: 'You Win!', description: `All gems cleared! +${winBonus} bonus points.` });
          setScore(s => s + winBonus);
        } else if (newBubbles.some(b => b.y + BUBBLE_RADIUS > SHOOTER_Y - BUBBLE_RADIUS * 2)) {
          setGameOver('LOSE');
          toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
        }
      } else {
        setProjectile(newProjectile);
      }
      
      animationFrameId = requestAnimationFrame(gameUpdate);
    };

    animationFrameId = requestAnimationFrame(gameUpdate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [projectile, bubbles, addPoints, toast]);

   useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-headline text-primary">Score: {score.toLocaleString()}</div>
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
        <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT + 60} className="z-10" />
      </div>
       <div className="flex items-center gap-4 mt-2">
            <Button onClick={() => handleAngleChange('left')} variant="outline" size="icon" className="h-12 w-12"><ArrowLeft /></Button>
            <Button onClick={shoot} className="h-16 w-24 text-lg font-bold"><ArrowUp className="h-8 w-8" /></Button>
            <Button onClick={() => handleAngleChange('right')} variant="outline" size="icon" className="h-12 w-12"><ArrowRight /></Button>
       </div>
       <Button onClick={resetGame} variant="ghost" size="sm" className="mt-2"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
    </div>
  );
};

export default GemstoneBurst;

    