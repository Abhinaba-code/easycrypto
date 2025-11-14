'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface GamePaymentModalProps {
  game: {
    title: string;
    href: string;
    cost: number;
  } | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export function GamePaymentModal({ game, isOpen, onOpenChange, onConfirm }: GamePaymentModalProps) {
  const { user, updateWalletBalance } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  if (!game) return null;

  const handleConfirm = async () => {
    if (!user || user.walletBalance < game.cost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Funds',
        description: `You need $${game.cost} to play. Please top up your wallet.`,
      });
      onOpenChange(false);
      return;
    }
    await updateWalletBalance(-game.cost);
    toast({
      title: 'Payment Successful!',
      description: `$${game.cost} has been deducted from your wallet. Good luck!`,
    });
    onConfirm();
    onOpenChange(false);
    router.push(game.href);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Game Entry</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to pay{' '}
            <span className="font-bold text-primary">${game.cost}</span> to play{' '}
            <span className="font-bold">{game.title}</span>. This amount will be deducted from your virtual wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Pay & Play
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
