
export interface Transaction {
  id: string;
  title: string;
  date: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status?: 'completed' | 'processing' | 'failed';
}

export interface UserProfile {
  name: string;
  balance: number;
  dailyTarget: number;
  currency: string;
  email?: string;
  level?: number; // 1 to 5
  processingMode?: boolean;
  linkingStatus?: 'none' | 'pending' | 'approved' | 'declined';
  linkingDetails?: {
    accountNumber: string;
    bank: string;
    accountName: string;
    proofBase64?: string;
  };
  hasProcessingWithdrawal?: boolean;
}

export type View = 'wallet' | 'history' | 'profile' | 'explore' | 'withdraw' | 'deposit' | 'my-jobs' | 'community' | 'notifications' | 'invite' | 'free-withdraw' | 'jobs' | 'upgrade' | 'commercial' | 'games' | 'link-account';

export interface Testimonial {
  id: string;
  user: string;
  comment: string;
  time: string;
  amount?: string;
}
