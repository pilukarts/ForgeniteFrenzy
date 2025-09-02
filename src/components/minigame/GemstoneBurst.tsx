
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight, ArrowUp, Bomb, Sparkles } from 'lucide-react';

// --- Game Constants & Types ---
const COLS = 11;
const ROWS = 14;
const BUBBLE_RADIUS = 16;
const BOARD_WIDTH = COLS * BUBBLE_RADIUS * 2 + BUBBLE_RADIUS;
const BOARD_HEIGHT = ROWS * BUBBLE_RADIUS * 1.732;
const SHOOTER_Y = BOARD_HEIGHT + BUBBLE_RADIUS * 2;
const PROJECTILE_SPEED = 20;
const SHOTS_BEFORE_ADVANCE = 5;

const COLORS = ['#FF5A5A', '#FFD700', '#5AFF5A', '#5A5AFF', '#FF5AE4', '#5AFFFF'];
type BubbleColor = string;
type SpecialType = 'bomb' | 'rainbow' | null;

interface Bubble {
  id: number;
  x: number;
  y: number;
  row: number;
  col: number;
  color: BubbleColor;
  special: SpecialType;
  isStatic: boolean;
}

interface Projectile extends Omit<Bubble, 'row' | 'col' | 'isStatic'> {
  vx: number;
  vy: number;
}

const GemstoneBurst: React.FC = () => {
  const { addPoints } = useGame();
  const { toast } = useToast();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [nextBubble, setNextBubble] = useState<{ color: BubbleColor; special: SpecialType }>({ color: COLORS[0], special: null });
  const [shooterAngle, setShooterAngle] = useState(0);
  const [score, setScore] = useState(0);
  const [shotsFired, setShotsFired] = useState(0);
  const [gameOver, setGameOver] = useState<false | 'WIN' | 'LOSE'>(false);
  const bubbleIdCounter = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  // This is the key change: ensure component is mounted on the client before doing anything.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getGridPos = (row: number, col: number) => {
    const x = col * BUBBLE_RADIUS * 2 + (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
    const y = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
    return { x, y };
  };

  const getNextBubble = useCallback((): { color: BubbleColor; special: SpecialType } => {
    const availableColors = [...new Set(bubbles.filter(b => b.isStatic && b.special === null).map(b => b.color))];
    
    // 10% chance for a special bubble
    if (Math.random() < 0.1) {
        return Math.random() < 0.5
            ? { color: '#333333', special: 'bomb' }
            : { color: 'white', special: 'rainbow' };
    }

    if (availableColors.length > 0) {
        return { color: availableColors[Math.floor(Math.random() * availableColors.length)], special: null };
    }
    return { color: COLORS[Math.floor(Math.random() * COLORS.length)], special: null };
  }, [bubbles]);

  const resetGame = useCallback(() => {
    bubbleIdCounter.current = 0;
    const initialBubbles: Bubble[] = [];
    for (let row = 0; row < 5; row++) {
        const numCols = row % 2 === 0 ? COLS : COLS - 1;
        for (let col = 0; col < numCols; col++) {
            if (col < numCols) {
                const { x, y } = getGridPos(row, col);
                initialBubbles.push({
                    id: bubbleIdCounter.current++,
                    x, y, row, col,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    special: null,
                    isStatic: true,
                });
            }
        }
    }
    setBubbles(initialBubbles);
    setProjectile(null);
    setScore(0);
    setGameOver(false);
    setShooterAngle(0);
    setShotsFired(0);
    setNextBubble(getNextBubble());
  }, [getNextBubble]);

  useEffect(() => {
    if (isClient) {
      resetGame();
    }
  }, [isClient, resetGame]);

  const advanceBubbles = useCallback(() => {
    let isGameOver = false;
    const newBubbles = bubbles.map(b => {
        const { y: newY } = getGridPos(b.row + 1, b.col);
        if (newY + BUBBLE_RADIUS >= SHOOTER_Y - BUBBLE_RADIUS * 2) {
            isGameOver = true;
        }
        return { ...b, y: newY, row: b.row + 1 };
    });

    const newRow = 0;
    const numCols = newRow % 2 === 0 ? COLS : COLS - 1;
    for (let col = 0; col < numCols; col++) {
        const { x, y } = getGridPos(newRow, col);
        newBubbles.push({
            id: bubbleIdCounter.current++,
            x, y, row: newRow, col,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            special: null,
            isStatic: true
        });
    }

    setBubbles(newBubbles);

    if (isGameOver && !gameOver) {
        setGameOver('LOSE');
        toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
    }
  }, [bubbles, gameOver, toast]);

  useEffect(() => {
      if (shotsFired > 0 && shotsFired % SHOTS_BEFORE_ADVANCE === 0) {
          advanceBubbles();
      }
  }, [shotsFired, advanceBubbles]);

  const shoot = useCallback(() => {
    if (projectile || gameOver) return;
    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    setProjectile({
      id: bubbleIdCounter.current++,
      x: BOARD_WIDTH / 2,
      y: SHOOTER_Y,
      color: nextBubble.color,
      special: nextBubble.special,
      vx: Math.cos(angleRad) * PROJECTILE_SPEED,
      vy: Math.sin(angleRad) * PROJECTILE_SPEED,
    });
    setShotsFired(prev => prev + 1);
    setNextBubble(getNextBubble());
  }, [projectile, gameOver, shooterAngle, nextBubble, getNextBubble]);

  const findNeighbors = (target: Bubble, allBubbles: Bubble[]): Bubble[] => {
      return allBubbles.filter(other => {
          if (target.id === other.id || !other.isStatic) return false;
          const dist = Math.hypot(target.x - other.x, target.y - other.y);
          return dist < BUBBLE_RADIUS * 2.1;
      });
  };

  const getMatches = (startBubble: Bubble, allBubbles: Bubble[]): Bubble[] => {
    if (startBubble.special) return [];

    const toCheck = [startBubble];
    const checked = new Set<number>([startBubble.id]);
    const matches: Bubble[] = [];

    while (toCheck.length > 0) {
        const current = toCheck.pop()!;
        if (current.special === 'rainbow' || current.color === startBubble.color) {
            matches.push(current);
            const neighbors = findNeighbors(current, allBubbles);
            for (const neighbor of neighbors) {
                if (!checked.has(neighbor.id)) {
                    checked.add(neighbor.id);
                    if (neighbor.special === 'rainbow' || neighbor.color === startBubble.color) {
                      toCheck.push(neighbor);
                    }
                }
            }
        }
    }
    return matches;
  };

  const getFloatingBubbles = (allBubbles: Bubble[]): Bubble[] => {
      const staticBubbles = allBubbles.filter(b => b.isStatic);
      const checked = new Set<number>();
      const toCheck: Bubble[] = [];

      staticBubbles.forEach(b => {
          if (b.row === 0) {
              toCheck.push(b);
              checked.add(b.id);
          }
      });

      let head = 0;
      while(head < toCheck.length) {
          const current = toCheck[head++];
          const neighbors = findNeighbors(current, staticBubbles);
          for (const neighbor of neighbors) {
              if (!checked.has(neighbor.id)) {
                  checked.add(neighbor.id);
                  toCheck.push(neighbor);
              }
          }
      }

      return staticBubbles.filter(b => !checked.has(b.id));
  };
  
  const handleCollision = (proj: Projectile) => {
    let bestSnapPos: { x: number; y: number; row: number; col: number; dist: number } | null = null;
    
    // Calculate the potential final row/col
    const estRow = Math.round((proj.y - BUBBLE_RADIUS) / (BUBBLE_RADIUS * 1.732));
    const numColsInEstRow = estRow % 2 === 0 ? COLS : COLS - 1;
    const estCol = Math.round(
      (proj.x - (estRow % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2)) / (BUBBLE_RADIUS * 2)
    );
    
    for(let r = Math.max(0, estRow - 2); r < Math.min(ROWS, estRow + 3); r++) {
        const numCols = r % 2 === 0 ? COLS : COLS - 1;
        for (let c = Math.max(0, estCol - 2); c < Math.min(numCols, estCol + 3); c++) {
            if (bubbles.some(b => b.row === r && b.col === c && b.isStatic)) continue;
            
            const gridPos = getGridPos(r, c);
            const dist = Math.hypot(proj.x - gridPos.x, proj.y - gridPos.y);

            let hasNeighbor = bubbles.some(b => b.isStatic && Math.hypot(gridPos.x - b.x, gridPos.y - b.y) < BUBBLE_RADIUS * 2.1);
            
            if ((r === 0 || hasNeighbor) && (!bestSnapPos || dist < bestSnapPos.dist)) {
                bestSnapPos = { ...gridPos, row: r, col: c, dist };
            }
        }
    }

    if (!bestSnapPos) {
        setProjectile(null);
        return;
    }
    
    const newBubble: Bubble = {
        id: proj.id,
        x: bestSnapPos.x,
        y: bestSnapPos.y,
        row: bestSnapPos.row,
        col: bestSnapPos.col,
        color: proj.color,
        special: proj.special,
        isStatic: true,
    };
    
    let tempBubbles = [...bubbles, newBubble];
    let bubblesToRemove = new Set<number>();
    let pointsThisShot = 0;

    if (newBubble.special === 'bomb') {
        const neighbors = findNeighbors(newBubble, tempBubbles);
        neighbors.forEach(n => bubblesToRemove.add(n.id));
        bubblesToRemove.add(newBubble.id);
        pointsThisShot += bubblesToRemove.size * 20;
        toast({ title: 'KABOOM!', description: `Bomb cleared ${bubblesToRemove.size} gems!`});
    } else {
        if (newBubble.special === 'rainbow') {
            const neighbors = findNeighbors(newBubble, tempBubbles);
            const targetColor = neighbors.length > 0 ? neighbors[0].color : COLORS[0];
            const rainbowMatches = getMatches({...newBubble, color: targetColor, special: null}, tempBubbles);
             if (rainbowMatches.length >= 2) { // 2 + rainbow itself
                rainbowMatches.forEach(m => bubblesToRemove.add(m.id));
                bubblesToRemove.add(newBubble.id);
                pointsThisShot += (rainbowMatches.length + 1) * 10 * (rainbowMatches.length + 1);
            }
        } else {
            const matches = getMatches(newBubble, tempBubbles);
            if (matches.length >= 3) {
                matches.forEach(m => bubblesToRemove.add(m.id));
                pointsThisShot += matches.length * 10 * matches.length;
            }
        }
    }

    if (bubblesToRemove.size > 0) {
        tempBubbles = tempBubbles.filter(b => !bubblesToRemove.has(b.id));
        const floating = getFloatingBubbles(tempBubbles);
        if(floating.length > 0) {
            floating.forEach(f => bubblesToRemove.add(f.id));
            pointsThisShot += floating.length * 50;
            toast({ title: 'Nice Drop!', description: `+${floating.length * 50} bonus points!` });
        }
    }
    
    if (pointsThisShot > 0) {
        setScore(s => s + pointsThisShot);
        addPoints(pointsThisShot);
    }
    
    if (bubblesToRemove.size > 0) {
      setBubbles(bubbles.filter(b => !bubblesToRemove.has(b.id)));
    } else {
      setBubbles(prev => [...prev, newBubble]);
    }
    
    setProjectile(null);

    // Check game state after shot
    setTimeout(() => {
        setBubbles(currentBubbles => {
            if (currentBubbles.filter(b => b.isStatic).length === 0) {
                if (!gameOver) {
                    setGameOver('WIN');
                    const winBonus = 5000;
                    addPoints(winBonus); setScore(s => s + winBonus);
                    toast({ title: 'You Win!', description: `All gems cleared! +${winBonus} bonus points.` });
                }
            } else if (currentBubbles.some(b => b.y + BUBBLE_RADIUS >= SHOOTER_Y - BUBBLE_RADIUS*2)) {
                 if (!gameOver) {
                    setGameOver('LOSE');
                    toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
                 }
            }
            return currentBubbles;
        });
    }, 100);
  };
  
  useEffect(() => {
    if (!isClient) return;
    let animationFrameId: number;

    const gameUpdate = () => {
      if (projectile) {
        const newX = projectile.x + projectile.vx;
        const newY = projectile.y + projectile.vy;

        let collided = false;

        if (newX - BUBBLE_RADIUS < 0 || newX + BUBBLE_RADIUS > BOARD_WIDTH) {
          setProjectile(p => p ? { ...p, vx: -p.vx } : null);
        } else {
          if (newY - BUBBLE_RADIUS <= 0) {
              collided = true;
          } else {
              for (const bubble of bubbles) {
                  if (bubble.isStatic && Math.hypot(newX - bubble.x, newY - bubble.y) < BUBBLE_RADIUS * 2) {
                      collided = true;
                      break;
                  }
              }
          }
          
          if(collided) {
             handleCollision({ ...projectile, x: newX, y: newY });
          } else {
             setProjectile(p => p ? { ...p, x: newX, y: newY } : null);
          }
        }
      }
      animationFrameId = requestAnimationFrame(gameUpdate);
    };

    animationFrameId = requestAnimationFrame(gameUpdate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isClient, projectile, bubbles, addPoints, toast, gameOver]);

  const drawGame = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw bubbles
      bubbles.forEach(bubble => {
          if (!bubble.isStatic) return;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
          if (bubble.special === 'rainbow') {
            const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, BUBBLE_RADIUS);
            COLORS.forEach((c, i) => gradient.addColorStop(i / (COLORS.length -1), c));
            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = bubble.color;
          }
          ctx.fill();
          if (bubble.special === 'bomb') {
              ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif';
              ctx.fillText('B', bubble.x, bubble.y);
          }
      });
      // Draw projectile
      if (projectile) {
          ctx.beginPath();
          ctx.arc(projectile.x, projectile.y, BUBBLE_RADIUS, 0, Math.PI * 2);
          if (projectile.special === 'rainbow') {
             const gradient = ctx.createRadialGradient(projectile.x, projectile.y, 0, projectile.x, projectile.y, BUBBLE_RADIUS);
            COLORS.forEach((c, i) => gradient.addColorStop(i / (COLORS.length - 1), c));
            ctx.fillStyle = gradient;
          } else {
             ctx.fillStyle = projectile.color;
          }
          ctx.fill();
           if (projectile.special === 'bomb') {
            ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif';
            ctx.fillText('B', projectile.x, projectile.y);
          }
      }
      // Draw shooter
      const shooterX = BOARD_WIDTH / 2;
      const angleRad = (shooterAngle - 90) * Math.PI / 180;
      const endX = shooterX + 40 * Math.cos(angleRad);
      const endY = SHOOTER_Y + 40 * Math.sin(angleRad);
      ctx.beginPath(); ctx.moveTo(shooterX, SHOOTER_Y); ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.stroke();
      // Draw next bubble
      ctx.beginPath(); ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS + 2, 0, Math.PI * 2);
       if(nextBubble.special === 'rainbow') {
        const gradient = ctx.createRadialGradient(shooterX, SHOOTER_Y, 0, shooterX, SHOOTER_Y, BUBBLE_RADIUS);
        COLORS.forEach((c, i) => gradient.addColorStop(i / (COLORS.length-1), c));
        ctx.fillStyle = gradient;
      } else {
         ctx.fillStyle = nextBubble.color;
      }
      ctx.fill();
      if (nextBubble.special === 'bomb') {
        ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif';
        ctx.fillText('B', shooterX, SHOOTER_Y);
      }

  }, [bubbles, projectile, shooterAngle, nextBubble]);

  useEffect(() => {
    let animFrame: number;
    const renderLoop = () => {
      drawGame();
      animFrame = requestAnimationFrame(renderLoop);
    };
    if (isClient) {
      animFrame = requestAnimationFrame(renderLoop);
    }
    return () => {
      if(animFrame) cancelAnimationFrame(animFrame);
    }
  }, [isClient, drawGame]);


  const handleAngleChange = (direction: 'left' | 'right') => {
    if (gameOver) return;
    setShooterAngle(prev => Math.max(-80, Math.min(80, prev + (direction === 'left' ? -15 : 15))));
  };

  useEffect(() => {
    if (!isClient) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft': handleAngleChange('left'); break;
        case 'ArrowRight': handleAngleChange('right'); break;
        case 'ArrowUp': case ' ': shoot(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, gameOver, shoot]);

  const renderNextBubbleIcon = () => {
    if (nextBubble.special === 'bomb') return <Bomb className="h-8 w-8 text-white" />;
    if (nextBubble.special === 'rainbow') return <Sparkles className="h-8 w-8 text-purple-400" />;
    return <ArrowUp className="h-8 w-8" />;
  };

  if (!isClient) {
    return <div className="text-lg font-headline text-primary animate-pulse">Loading Minigame...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-headline text-primary">Score: {score.toLocaleString()}</div>
      <div className="relative bg-card rounded-lg border-2 border-primary shadow-lg" style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT + 60 }}>
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
        <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT + 60} className="z-10 rounded-lg" />
      </div>
      <div className="flex items-center gap-4 mt-2">
        <Button onClick={() => handleAngleChange('left')} variant="outline" size="icon" className="h-12 w-12"><ArrowLeft /></Button>
        <Button onClick={shoot} className="h-16 w-24 text-lg font-bold">
          {renderNextBubbleIcon()}
        </Button>
        <Button onClick={() => handleAngleChange('right')} variant="outline" size="icon" className="h-12 w-12"><ArrowRight /></Button>
      </div>
      <Button onClick={resetGame} variant="ghost" size="sm" className="mt-2"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
    </div>
  );
};

export default GemstoneBurst;

    