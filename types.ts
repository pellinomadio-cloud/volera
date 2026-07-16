
export interface Transaction {
  id: string;
  title: string;
  date: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface UserProfile {
  name: string;
  balance: number;
  dailyTarget: number;
  currency: string;
  email?: string;
}

export type View = 'wallet' | 'history' | 'profile' | 'explore' | 'withdraw' | 'buy-node' | 'community' | 'notifications' | 'invite' | 'free-withdraw';

export interface Testimonial {
  id: string;
  user: string;
  comment: string;
  time: string;
  amount?: string;
}
