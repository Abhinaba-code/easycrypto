
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Coins, Wallet, Car, Users, Bot, CircleDot, Asterisk, CandlestickChart, Rocket, Hand, Diamond, Clapperboard, Puzzle, Swords, Dice5, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';
import { TopUpWalletModal } from '@/components/top-up-wallet-modal';
import { GamePaymentModal } from '@/components/game-payment-modal';

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

interface Game {
    title: string;
    icon: React.ReactNode;
    description: string;
    href: string;
    cost: number;
}

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <Card 
        onClick={() => onPlay(game)}
        className="h-full border-primary border-2 shadow-lg hover:border-primary-foreground hover:shadow-xl transition-all flex flex-col cursor-pointer"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {game.icon}
                <CardTitle>{game.title}</CardTitle>
            </div>
            <div className="font-bold text-primary text-lg">${game.cost}</div>
        </div>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-end justify-center">
          <p className="text-sm font-medium text-primary">Play Game &rarr;</p>
      </CardContent>
    </Card>
  );
};

const games: Game[] = [
    { title: "Crypto Flip", icon: <Coins className="h-6 w-6 text-primary" />, description: "Guess if Bitcoin's price will rise or fall.", href: '/games/crypto-flip', cost: 50 },
    { title: "Coin Toss", icon: <Coins className="h-8 w-8 text-primary" />, description: "A classic fifty-fifty. Heads or Tails? You decide.", href: '/games/coin-toss', cost: 10 },
    { title: "Crypto Ludo", icon: <Dice5 className="h-8 w-8 text-primary" />, description: "Roll a 6 to win the pot! A simple dice game.", href: '/games/crypto-ludo', cost: 20 },
    { title: "Ether Snake", icon: <SnakeIcon className="h-8 w-8 text-primary" />, description: "Grow your snake by eating ether tokens.", href: '/games/ether-snake', cost: 25 },
    { title: "Crypto Racers", icon: <Car className="h-8 w-8 text-primary" />, description: "Beat the other cars to the finish line to win.", href: '/games/crypto-racers', cost: 100 },
    { title: "Bitcoin Poker", icon: <Users className="h-8 w-8 text-primary" />, description: "Get the best hand to win the pot. Test your poker face!", href: '/games/bitcoin-poker', cost: 150 },
    { title: "AI Blackjack", icon: <Bot className="h-8 w-8 text-primary" />, description: "Play against the AI dealer. Can you beat the house?", href: '/games/ai-blackjack', cost: 75 },
    { title: "Doge Roulette", icon: <CircleDot className="h-8 w-8 text-primary" />, description: "Bet on your lucky number. Will it be red or black?", href: '/games/doge-roulette', cost: 40 },
    { title: "Shiba Slots", icon: <Asterisk className="h-8 w-8 text-primary" />, description: "Spin the slots. Can you get a jackpot?", href: '/games/shiba-slots', cost: 30 },
    { title: "Futures Trading Sim", icon: <CandlestickChart className="h-8 w-8 text-primary" />, description: "Go long or short on the market. Test your trading instincts.", href: '/games/futures-trading-sim', cost: 200 },
    { title: "To The Moon Rocket", icon: <Rocket className="h-8 w-8 text-primary" />, description: "Launch your rocket to the moon to win big!", href: '/games/to-the-moon-rocket', cost: 80 },
    { title: "Crypto Hold'em", icon: <Hand className="h-8 w-8 text-primary" />, description: "A classic game of Texas Hold'em with a crypto twist.", href: '/games/crypto-holdem', cost: 120 },
    { title: "Diamond Hands", icon: <Diamond className="h-8 w-8 text-primary" />, description: "Hold on for dear life! How long can you last?", href: '/games/diamond-hands', cost: 60 },
    { title: "NFT Bingo", icon: <Clapperboard className="h-8 w-8 text-primary" />, description: "Match three NFT icons in a row to win!", href: '/games/nft-bingo', cost: 35 },
    { title: "DeFi Puzzle", icon: <Puzzle className="h-8 w-8 text-primary" />, description: "Solve the puzzle to unlock DeFi secrets.", href: '/games/defi-puzzle', cost: 15 },
    { title: "Chainlink Champions", icon: <Swords className="h-8 w-8 text-primary" />, description: "Battle other champions. Who will be victorious?", href: '/games/chainlink-champions', cost: 90 },
    { title: "Ripple Dice", icon: <Dice5 className="h-8 w-8 text-primary" />, description: "Roll a 4 or higher to win!", href: '/games/ripple-dice', cost: 20 },
    { title: "Bullseye Bets", icon: <Target className="h-8 w-8 text-primary" />, description: "Hit the target to win a prize.", href: '/games/bullseye-bets', cost: 45 },
    { title: "Token Tussle", icon: <Users className="h-8 w-8 text-primary" />, description: "Pit your token against another. Who will win?", href: '/games/token-tussle', cost: 55 },
    { title: "Gas Fee Gamble", icon: <Zap className="h-8 w-8 text-primary" />, description: "Guess if gas fees will be high or low.", href: '/games/gas-fee-gamble', cost: 25 },
];


export default function ArcadePage() {
  const { user } = useAuth();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePlayGame = (game: Game) => {
    if (!user) {
      // Or show a toast/modal to login
      return;
    }
    setSelectedGame(game);
    setIsPaymentModalOpen(true);
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Gamepad2 className="h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Crypto Arcade</h1>
        </div>
       {user && (
         <Card 
            className="w-full sm:w-auto cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsTopUpModalOpen(true)}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Wallet className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-sm font-medium leading-none">Virtual Wallet</CardTitle>
                <p className="text-2xl font-bold">${typeof user.walletBalance === 'number' ? user.walletBalance.toLocaleString() : '...'}</p>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {games.map(game => (
            <GameCard key={game.title} game={game} onPlay={handlePlayGame} />
        ))}
      </div>
      <TopUpWalletModal isOpen={isTopUpModalOpen} onOpenChange={setIsTopUpModalOpen} />
      <GamePaymentModal 
        game={selectedGame}
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onConfirm={() => {
            // The navigation is handled inside the modal now
        }}
      />
    </div>
  );
}
