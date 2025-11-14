
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { DollarSign } from 'lucide-react';

interface TopUpWalletModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const presetAmounts = [100, 250, 500, 1000];

export function TopUpWalletModal({ isOpen, onOpenChange }: TopUpWalletModalProps) {
  const { updateWalletBalance } = useAuth();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState('');

  const handleAddFunds = async (amount: number) => {
    if (amount <= 0 || isNaN(amount)) {
        toast({
            variant: 'destructive',
            title: 'Invalid Amount',
            description: 'Please enter a positive number.',
        });
        return;
    }
    await updateWalletBalance(amount);
    toast({
      title: 'Funds Added!',
      description: `$${amount.toLocaleString()} has been added to your virtual wallet.`,
    });
    setCustomAmount('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign />
            Top Up Your Virtual Wallet
          </DialogTitle>
          <DialogDescription>
            Add more virtual funds to continue playing in the arcade. This is not real money.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm font-medium">Select an amount:</p>
          <div className="grid grid-cols-2 gap-4">
            {presetAmounts.map(amount => (
              <Button key={amount} variant="outline" onClick={() => handleAddFunds(amount)}>
                + ${amount.toLocaleString()}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-4">
            <Input
              type="number"
              placeholder="Or enter custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            <Button onClick={() => handleAddFunds(parseFloat(customAmount))}>Add</Button>
          </div>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
