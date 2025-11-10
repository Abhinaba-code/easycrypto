

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Coins, Loader2, RefreshCw, Wallet, PiggyBank, Car, Users, Bot, CircleDot, Asterisk, CandlestickChart, Rocket, Hand, Diamond, Clapperboard, Puzzle, Swords, Dice5, Target, Zap, LogIn } from 'lucide-react';
import { getCoinDetails } from '@/lib/coingecko';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';


const SnakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.5 8.5c0-1.1.9-2 2-2s2 .9 2 2" />
    <path d="M11.5 15.5c0 1.1.9 2-2s2-.9 2-2" />
    <path d="M5.5 15.5c0 1.1.9 2-2s2-.9 2-2" />
    <path d="M12 2v2" />
    <path d="M12 10v4" />
    <path d="M12 20v2" />
    <path d="M20 12h2" />
    <path d="M18 12h-4" />
    <path d="M6 12H2" />
    <path d="M10 12H8" />
  </svg>
);


type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

interface GameCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  isActive?: boolean;
  gameType: 'crypto-flip' | 'coin-toss' | 'crypto-ludo' | 'ether-snake' | 'crypto-racers' | 'bitcoin-poker' | 'ai-blackjack' | 'doge-roulette' | 'shiba-slots' | 'futures-trading-sim' | 'to-the-moon-rocket' | 'crypto-holdem' | 'diamond-hands' | 'nft-bingo' | 'defi-puzzle' | 'chainlink-champions' | 'ripple-dice' | 'coming-soon';
}

const slotSymbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎'];
const bingoSymbols = ['🐵', '🤖', '👽', '💀', '🎨'];

const GameCard: React.FC<GameCardProps> = ({ title, icon, description, isActive = false, gameType }) => {
  const [gameState, setGameState] = useState<'playing' | 'loading' | 'won' | 'lost' | 'finished'>('playing');
  const [initialPrice, setInitialPrice] = useState<number | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const router = useRouter();
  const { user } = useAuth();
  
  // Blackjack state
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  // Slots state
  const [slots, setSlots] = useState(['🍒', '🍋', '🍊']);

  // Diamond Hands state
  const [holdTime, setHoldTime] = useState(0);
  const [holdInterval, setHoldInterval] = useState<NodeJS.Timeout | null>(null);

  // NFT Bingo state
  const [bingoCard, setBingoCard] = useState<string[][]>([[],[],[]]);
  const [drawnSymbol, setDrawnSymbol] = useState<string | null>(null);

  const calculateScore = (hand: number[]) => hand.reduce((a, b) => a + b, 0);

  const startGame = useCallback(() => {
    const newPlayerHand = [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2];
    const newDealerHand = [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2];
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore(newDealerHand));
    setGameState('playing');
    setResult(null);
  }, []);

  const handleHit = () => {
    const newCard = Math.floor(Math.random() * 10) + 2;
    const newHand = [...playerHand, newCard];
    const newScore = calculateScore(newHand);
    setPlayerHand(newHand);
    setPlayerScore(newScore);
    if (newScore > 21) {
      setGameState('lost');
      setResult({ title: "Bust!", variant: 'destructive', description: `You went over 21 with ${newScore}.` });
    }
  };

  const handleStand = () => {
    setGameState('finished');
    if (playerScore > dealerScore || dealerScore > 21) {
      setGameState('won');
      setResult({ title: "You Win!", variant: 'default', description: `Your ${playerScore} beats the dealer's ${dealerScore}.` });
    } else if (playerScore < dealerScore) {
      setGameState('lost');
      setResult({ title: "You Lose!", variant: 'destructive', description: `Dealer's ${dealerScore} beats your ${playerScore}.` });
    } else {
      setGameState('lost');
      setResult({ title: "Push!", variant: 'destructive', description: `You both have ${playerScore}.` });
    }
  };


  const fetchBtcPrice = useCallback(async () => {
    try {
      const btc = await getCoinDetails('bitcoin');
      return btc.market_data.current_price.usd;
    } catch (error) {
      console.error("Failed to fetch Bitcoin price", error);
      return null;
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameState('playing');
    setResult(null);
    if (gameType === 'crypto-flip') {
      setGameState('loading');
      fetchBtcPrice().then(price => {
        setInitialPrice(price);
        setGameState('playing');
      });
    }
    if (gameType === 'ai-blackjack') {
      startGame();
    }
    if (gameType === 'shiba-slots') {
      setSlots(['🍒', '🍋', '🍊']);
    }
     if (gameType === 'diamond-hands') {
      setHoldTime(0);
      if (holdInterval) clearInterval(holdInterval);
      setHoldInterval(null);
    }
    if (gameType === 'nft-bingo') {
      const newCard = Array(3).fill(0).map(() => 
        Array(3).fill(0).map(() => bingoSymbols[Math.floor(Math.random() * bingoSymbols.length)])
      );
      setBingoCard(newCard);
      setDrawnSymbol(null);
    }
  }, [fetchBtcPrice, gameType, startGame, holdInterval]);

  useEffect(() => {
    if (isActive && user) {
      resetGame();
    }
     return () => {
      if (holdInterval) clearInterval(holdInterval);
    };
  }, [resetGame, isActive, user]);

  const handleCryptoFlipGuess = (guess: 'up' | 'down') => {
    if (!initialPrice) return;
    setGameState('loading');
    router.push(`/games/crypto-flip/${guess}?price=${initialPrice}`);
  };
  
  const handleCoinTossGuess = (guess: 'heads' | 'tails') => {
    setGameState('loading');
    router.push(`/games/coin-toss/${guess}`);
  };
  
  const handleLudoRoll = () => {
    setGameState('loading');
    setTimeout(() => {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      if (diceRoll === 6) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `You rolled a ${diceRoll}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `You rolled a ${diceRoll}. You need a 6 to win.` });
      }
    }, 1500);
  };

  const handleRippleDice = () => {
    setGameState('loading');
    setTimeout(() => {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      if (diceRoll >= 4) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `You rolled a ${diceRoll}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `You rolled a ${diceRoll}. You need a 4 or higher to win.` });
      }
    }, 1500);
  };

  const handleSnakeGame = () => {
    setGameState('loading');
    setTimeout(() => {
      const length = Math.floor(Math.random() * 20) + 5;
      if (length > 15) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your snake grew to ${length}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Your snake only grew to ${length}. Try again!` });
      }
    }, 1500);
  };

  const handleCryptoRacers = () => {
    setGameState('loading');
    router.push('/games/crypto-racers');
  };
  
  const handleBitcoinPoker = () => {
    setGameState('loading');
    setTimeout(() => {
      const hands = ["Royal Flush", "Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight", "Three of a Kind", "Two Pair", "One Pair", "High Card"];
      const yourHand = hands[Math.floor(Math.random() * hands.length)];
      const opponentHand = hands[Math.floor(Math.random() * hands.length)];
      const yourHandIndex = hands.indexOf(yourHand);
      const opponentHandIndex = hands.indexOf(opponentHand);

      if (yourHandIndex < opponentHandIndex) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your ${yourHand} beats their ${opponentHand}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Their ${opponentHand} beats your ${yourHand}.` });
      }
    }, 1500);
  };

  const handleCryptoHoldem = () => {
    setGameState('loading');
    setTimeout(() => {
      const hands = ["Royal Flush", "Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight", "Three of a Kind", "Two Pair", "One Pair", "High Card"];
      const yourHand = hands[Math.floor(Math.random() * hands.length)];
      const opponentHand = hands[Math.floor(Math.random() * hands.length)];
      const yourHandIndex = hands.indexOf(yourHand);
      const opponentHandIndex = hands.indexOf(opponentHand);

      if (yourHandIndex < opponentHandIndex) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your ${yourHand} beats their ${opponentHand}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Their ${opponentHand} beats your ${yourHand}.` });
      }
    }, 1500);
  };

  const handleDogeRoulette = (bet: 'red' | 'black') => {
    setGameState('loading');
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37); // 0-36
      const winningColor = winningNumber === 0 ? 'green' : (winningNumber % 2 === 0 ? 'black' : 'red');

      if (bet === winningColor) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `The ball landed on ${winningNumber} (${winningColor}). You chose ${bet}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `The ball landed on ${winningNumber} (${winningColor}). You chose ${bet}.` });
      }
    }, 1500);
  };
  
  const handleShibaSlots = () => {
    setGameState('loading');
    setTimeout(() => {
      const newSlots = [
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ];
      setSlots(newSlots);

      if (newSlots[0] === newSlots[1] && newSlots[1] === newSlots[2]) {
        setGameState('won');
        setResult({ title: "Jackpot!", variant: 'default', description: `You got three ${newSlots[0]}s!` });
      } else {
        setGameState('lost');
        setResult({ title: "Try Again!", variant: 'destructive', description: "No win this time." });
      }
    }, 1500);
  };

  const handleFuturesTradingSim = (bet: 'long' | 'short') => {
    setGameState('loading');
    setTimeout(() => {
      const priceWentUp = Math.random() > 0.5;
      if ((bet === 'long' && priceWentUp) || (bet === 'short' && !priceWentUp)) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `You went ${bet} and the market moved in your favor!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `You went ${bet} and the market moved against you.` });
      }
    }, 1500);
  };

  const handleToTheMoonRocket = () => {
    setGameState('loading');
    setTimeout(() => {
      if (Math.random() > 0.7) {
        setGameState('won');
        setResult({ title: "To The Moon!", variant: 'default', description: "Your rocket made it to the moon! You win!" });
      } else {
        setGameState('lost');
        setResult({ title: "Launch Failed", variant: 'destructive', description: "Your rocket exploded on the launchpad. Better luck next time." });
      }
    }, 1500);
  };

   const startHolding = () => {
    setGameState('loading'); // Using 'loading' state for 'holding'
    setResult(null);
    setHoldTime(0);
    const interval = setInterval(() => {
      setHoldTime(prev => prev + 0.1);
    }, 100);
    setHoldInterval(interval);
  };

  const stopHolding = () => {
    if (holdInterval) {
      clearInterval(holdInterval);
      setHoldInterval(null);
    }
    setGameState('finished');
    if (holdTime < 3) {
      setGameState('lost');
      setResult({ title: "Paper Hands!", variant: 'destructive', description: `You only held for ${holdTime.toFixed(1)} seconds. Try again!` });
    } else {
      const winnings = Math.floor(holdTime * 100);
      setGameState('won');
      setResult({ title: "Diamond Hands!", variant: 'default', description: `You held for ${holdTime.toFixed(1)} seconds and won $${winnings}!` });
    }
  };

  const handleNftBingo = () => {
    setGameState('loading');
    setTimeout(() => {
      const newDrawnSymbol = bingoSymbols[Math.floor(Math.random() * bingoSymbols.length)];
      setDrawnSymbol(newDrawnSymbol);

      const newCard = bingoCard.map(row => row.map(cell => cell === newDrawnSymbol ? '✅' : cell));
      setBingoCard(newCard);

      // Check for win condition (any row, column, or diagonal of '✅')
      let hasWon = false;
      for(let i=0; i<3; i++) {
        if(newCard[i].every(c => c === '✅') || newCard.every(row => row[i] === '✅')) hasWon = true;
      }
      if((newCard[0][0] === '✅' && newCard[1][1] === '✅' && newCard[2][2] === '✅') || 
         (newCard[0][2] === '✅' && newCard[1][1] === '✅' && newCard[2][0] === '✅')) hasWon = true;
      
      if(hasWon) {
        setGameState('won');
        setResult({ title: "Bingo!", variant: 'default', description: `You completed a line!` });
      } else {
        setGameState('playing');
        setResult(null); // Keep playing
      }
    }, 1000);
  };
  
  const handleDefiPuzzle = (isCorrect: boolean) => {
    setGameState('loading');
    setTimeout(() => {
      if(isCorrect) {
        setGameState('won');
        setResult({ title: "Correct!", variant: 'default', description: `You solved the puzzle!` });
      } else {
        setGameState('lost');
        setResult({ title: "Incorrect!", variant: 'destructive', description: "That's not the right answer. Try again." });
      }
    }, 1000);
  }

  const handleChainlinkChampions = () => {
    setGameState('loading');
    setTimeout(() => {
      const yourAttack = Math.floor(Math.random() * 100) + 1;
      const opponentAttack = Math.floor(Math.random() * 100) + 1;
      if (yourAttack > opponentAttack) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your attack of ${yourAttack} beat the opponent's ${opponentAttack}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Your opponent's attack of ${opponentAttack} beat your ${yourAttack}.` });
      }
    }, 1500);
  };


  const renderLoginPrompt = () => (
    <>
      <p className="text-lg text-muted-foreground">Log in to play this game!</p>
      <Button size="lg" onClick={() => router.push('/login')}>
        <LogIn className="mr-2" />
        Login to Play
      </Button>
    </>
  )


  if (!isActive) {
    return (
       <Dialog>
        <DialogTrigger asChild>
          <Card className="border-dashed flex flex-col justify-center items-center text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <div className="flex justify-center mb-2">{icon}</div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title} - Coming Soon!</DialogTitle>
            <DialogDescription>
              This game is currently under development. Check back later to play!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const renderGameContent = () => {
    if (!user) return renderLoginPrompt();
    
    switch (gameType) {
      case 'crypto-flip':
        return (
          <>
            <p className="text-4xl font-bold">BTC</p>
            <p className="text-lg text-muted-foreground">
              {gameState === 'loading' ? <Loader2 className="animate-spin" /> : `Current Price: $${initialPrice?.toLocaleString()}`}
            </p>

            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => handleCryptoFlipGuess('up')} disabled={!initialPrice}>Up</Button>
                <Button size="lg" className="bg-red-500 hover:bg-red-600" onClick={() => handleCryptoFlipGuess('down')} disabled={!initialPrice}>Down</Button>
              </div>
            )}
          </>
        );
      case 'coin-toss':
         return (
          <>
            <p className="text-4xl font-bold">Heads or Tails?</p>
            <p className="text-lg text-muted-foreground">
              Call it in the air!
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => handleCoinTossGuess('heads')} disabled={gameState === 'loading'}>Heads</Button>
              <Button size="lg" onClick={() => handleCoinTossGuess('tails')} disabled={gameState === 'loading'}>Tails</Button>
            </div>
          </>
        );
      case 'crypto-ludo':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Roll a 6!</p>
                <p className="text-lg text-muted-foreground">
                  Roll the dice to get started.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleLudoRoll}>Roll Dice</Button>
              </div>
            )}
          </>
        );
       case 'ripple-dice':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Roll a 4+ to win!</p>
                <p className="text-lg text-muted-foreground">
                  Roll the dice and test your luck.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleRippleDice}>Roll Dice</Button>
              </div>
            )}
          </>
        );
      case 'ether-snake':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Grow your Snake!</p>
                <p className="text-lg text-muted-foreground">
                  Click play to see how long it gets.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleSnakeGame}>Play</Button>
              </div>
            )}
          </>
        );
      case 'crypto-racers':
        return (
          <>
            <p className="text-4xl font-bold">Start your Engine!</p>
            <p className="text-lg text-muted-foreground">
              Click race to see who wins!
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={handleCryptoRacers} disabled={gameState === 'loading'}>Race!</Button>
            </div>
          </>
        );
      case 'bitcoin-poker':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Best Hand Wins!</p>
                <p className="text-lg text-muted-foreground">
                  Click deal to see your hand.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleBitcoinPoker}>Deal</Button>
              </div>
            )}
          </>
        );
      case 'crypto-holdem':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Texas Hold'em</p>
                <p className="text-lg text-muted-foreground">
                  Click 'Deal' to see who wins the hand.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleCryptoHoldem}>Deal</Button>
              </div>
            )}
          </>
        );
       case 'ai-blackjack':
        return (
          <div className="w-full">
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <div className="text-center">
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">Dealer's Hand: {gameState === 'finished' ? dealerScore : '?'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Hand: {playerScore}</p>
                  <p className="text-xs">({playerHand.join(', ')})</p>
                </div>
              </div>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4 justify-center mt-4">
                <Button size="lg" onClick={handleHit}>Hit</Button>
                <Button size="lg" onClick={handleStand}>Stand</Button>
              </div>
            )}
          </div>
        );
      case 'doge-roulette':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Red or Black?</p>
                <p className="text-lg text-muted-foreground">
                  Place your bet!
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700" onClick={() => handleDogeRoulette('red')}>Red</Button>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800" onClick={() => handleDogeRoulette('black')}>Black</Button>
              </div>
            )}
          </>
        );
      case 'shiba-slots':
        return (
          <>
            <div className="flex items-center justify-center gap-4 text-4xl p-4 bg-muted/50 rounded-lg">
              <span>{slots[0]}</span>
              <span>{slots[1]}</span>
              <span>{slots[2]}</span>
            </div>
            {result && (
              <Alert variant={result.variant} className="mt-4 text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            )}
            {gameState === 'playing' && (
              <Button size="lg" onClick={handleShibaSlots} className="mt-4">Spin</Button>
            )}
          </>
        );
      case 'futures-trading-sim':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Long or Short?</p>
                <p className="text-lg text-muted-foreground">
                  Predict the market direction.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => handleFuturesTradingSim('long')}>Long</Button>
                <Button size="lg" className="bg-red-500 hover:bg-red-600" onClick={() => handleFuturesTradingSim('short')}>Short</Button>
              </div>
            )}
          </>
        );
      case 'to-the-moon-rocket':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Launch Time!</p>
                <p className="text-lg text-muted-foreground">
                  Click launch to start the countdown.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleToTheMoonRocket}>Launch</Button>
              </div>
            )}
          </>
        );
      case 'diamond-hands':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">
                  {gameState === 'loading' ? `${holdTime.toFixed(1)}s` : "Hold!"}
                </p>
                <p className="text-lg text-muted-foreground">
                  Hold the button to win.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                 <Button 
                  size="lg" 
                  onMouseDown={startHolding} 
                  onMouseUp={stopHolding}
                  onTouchStart={startHolding}
                  onTouchEnd={stopHolding}
                >
                  Hold On
                </Button>
              </div>
            )}
          </>
        );
      case 'nft-bingo':
        return (
          <div className="w-full">
            {result ? (
               <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
               <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded-lg">
                  {bingoCard.flat().map((symbol, index) => (
                    <div key={index} className="flex items-center justify-center h-10 w-10 text-2xl rounded-md bg-background">
                      {symbol}
                    </div>
                  ))}
                </div>
                {drawnSymbol && <p className="text-sm text-muted-foreground">Drawn: <span className="text-2xl">{drawnSymbol}</span></p>}
               </div>
            )}
            {gameState === 'playing' && (
              <Button size="lg" onClick={handleNftBingo} className="mt-4">Draw NFT</Button>
            )}
          </div>
        );
      case 'defi-puzzle':
        return (
          <div className="w-full">
            {result ? (
               <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
               <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-muted-foreground">What does "TVL" stand for in DeFi?</p>
                <div className="flex flex-col gap-2 w-full mt-2">
                    <Button variant="outline" onClick={() => handleDefiPuzzle(false)}>Total Value Lent</Button>
                    <Button variant="outline" onClick={() => handleDefiPuzzle(true)}>Total Value Locked</Button>
                    <Button variant="outline" onClick={() => handleDefiPuzzle(false)}>Total Volume Logged</Button>
                </div>
               </div>
            )}
          </div>
        );
      case 'chainlink-champions':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Battle!</p>
                <p className="text-lg text-muted-foreground">
                  Click 'Fight' to see who is stronger.
                </p>
              </>
            )}
            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={handleChainlinkChampions}>Fight</Button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };


  return (
    <Card className="border-primary border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[160px]">
        {gameState === 'loading' && gameType !== 'crypto-flip' && user ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
             <p className="text-muted-foreground">Loading Game...</p>
          </div>
        ) : renderGameContent()}
        
        {(gameState === 'won' || gameState === 'lost' || gameState === 'finished') && user && (
          <Button size="lg" variant="outline" onClick={resetGame}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const games = [
    { title: "Crypto Flip", icon: <Coins className="h-6 w-6 text-primary" />, description: "Guess if Bitcoin's price will rise or fall.", gameType: 'crypto-flip' as const, isActive: true },
    { title: "Coin Toss", icon: <Coins className="h-8 w-8 text-primary" />, description: "A classic fifty-fifty. Heads or Tails? You decide.", gameType: 'coin-toss' as const, isActive: true },
    { title: "Crypto Ludo", icon: <Dice5 className="h-8 w-8 text-primary" />, description: "Roll a 6 to win the pot! A simple dice game.", gameType: 'crypto-ludo' as const, isActive: true },
    { title: "Ether Snake", icon: <SnakeIcon className="h-8 w-8 text-primary" />, description: "Grow your snake by eating ether tokens.", gameType: 'ether-snake' as const, isActive: true },
    { title: "Crypto Racers", icon: <Car className="h-8 w-8 text-primary" />, description: "Beat the other cars to the finish line to win.", gameType: 'crypto-racers' as const, isActive: true },
    { title: "Bitcoin Poker", icon: <Users className="h-8 w-8 text-primary" />, description: "Get the best hand to win the pot. Test your poker face!", gameType: 'bitcoin-poker' as const, isActive: true },
    { title: "AI Blackjack", icon: <Bot className="h-8 w-8 text-primary" />, description: "Play against the AI dealer. Can you beat the house?", gameType: 'ai-blackjack' as const, isActive: true },
    { title: "Doge Roulette", icon: <CircleDot className="h-8 w-8 text-primary" />, description: "Bet on your lucky number. Will it be red or black?", gameType: 'doge-roulette' as const, isActive: true },
    { title: "Shiba Slots", icon: <Asterisk className="h-8 w-8 text-primary" />, description: "Spin the slots. Can you get a jackpot?", gameType: 'shiba-slots' as const, isActive: true },
    { title: "Futures Trading Sim", icon: <CandlestickChart className="h-8 w-8 text-primary" />, description: "Go long or short on the market. Test your trading instincts.", gameType: 'futures-trading-sim' as const, isActive: true },
    { title: "To The Moon Rocket", icon: <Rocket className="h-8 w-8 text-primary" />, description: "Launch your rocket to the moon to win big!", gameType: 'to-the-moon-rocket' as const, isActive: true },
    { title: "Crypto Hold'em", icon: <Hand className="h-8 w-8 text-primary" />, description: "A classic game of Texas Hold'em with a crypto twist.", gameType: 'crypto-holdem' as const, isActive: true },
    { title: "Diamond Hands", icon: <Diamond className="h-8 w-8 text-primary" />, description: "Hold on for dear life! How long can you last?", gameType: 'diamond-hands' as const, isActive: true },
    { title: "NFT Bingo", icon: <Clapperboard className="h-8 w-8 text-primary" />, description: "Match three NFT icons in a row to win!", gameType: 'nft-bingo' as const, isActive: true },
    { title: "DeFi Puzzle", icon: <Puzzle className="h-8 w-8 text-primary" />, description: "Solve the puzzle to unlock DeFi secrets.", gameType: 'defi-puzzle' as const, isActive: true },
    { title: "Chainlink Champions", icon: <Swords className="h-8 w-8 text-primary" />, description: "Battle other champions. Who will be victorious?", gameType: 'chainlink-champions' as const, isActive: true },
    { title: "Ripple Dice", icon: <Dice5 className="h-8 w-8 text-primary" />, description: "Roll a 4 or higher to win!", gameType: 'ripple-dice' as const, isActive: true },
    { title: "Bullseye Bets", icon: <Target className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' as const },
    { title: "Token Tussle", icon: <Users className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' as const },
    { title: "Gas Fee Gamble", icon: <Zap className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' as const },
];


export default function ArcadePage() {
  const { user } = useAuth();
  return (
    <div className="container py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Gamepad2 className="h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Crypto Arcade</h1>
        </div>
       {user && (
         <Card className="w-full sm:w-auto">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Wallet className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-sm font-medium leading-none">Virtual Wallet</CardTitle>
                <p className="text-2xl font-bold">$1,000</p>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {games.map(game => (
            <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  );
}

    

    




    

    