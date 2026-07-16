
import { Transaction, UserProfile, Testimonial } from './types';

export const MOCK_USER: UserProfile = {
  name: "Abdulsalam Olabisi",
  balance: 200000,
  dailyTarget: 200000,
  currency: "₦"
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Welcome Bonus',
    date: '5 Jan',
    category: 'bonus',
    amount: 200000,
    type: 'credit'
  }
];

export const WITHDRAWAL_ALERTS = [
  "James .O withdrew ₦560,670 to Access bank",
  "Chidi just withdrew ₦250,000 to OPay",
  "Okonkwo successfully cashed out ₦375,000 to GTBank",
  "Amina moved ₦200,000 to PalmPay",
  "Tunde just withdrew ₦445,000 to UBA",
  "Blessing cashed out ₦220,000 to Kuda Bank",
  "Ibrahim withdrew ₦300,000 to Access Bank",
  "Chioma moved ₦285,000 to Zenith Bank",
  "Musa successfully withdrew ₦260,000 to First Bank"
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '0',
    user: 'James .O',
    comment: 'Just withdrew ₦560,670 directly to Access bank! Extremely fast and reliable node infrastructure.',
    time: 'Just now',
    amount: '₦560,670'
  },
  {
    id: '1',
    user: 'Olawale J.',
    comment: 'Volerapay is a total life saver! I was able to pay my rent this month thanks to the seamless node withdrawals.',
    time: '2 mins ago',
    amount: '₦220,000'
  },
  {
    id: '2',
    user: 'Sarah M.',
    comment: 'The technology behind this app is insane. Transparent, fast, and reliable. Finally a platform that works for Nigerians.',
    time: '15 mins ago',
    amount: '₦245,000'
  },
  {
    id: '3',
    user: 'Emeka D.',
    comment: 'I was skeptical at first, but after my first withdrawal hit my bank in seconds, I knew this was the real deal.',
    time: '1 hour ago',
    amount: '₦200,000'
  },
  {
    id: '4',
    user: 'Zainab A.',
    comment: 'Volerapay helped me start my small business. The daily targets keep me focused and the NODE CODE is secure.',
    time: '3 hours ago',
    amount: '₦275,000'
  },
  {
    id: '5',
    user: 'David O.',
    comment: 'Best financial app in 2024. No hidden charges, just pure efficiency. Spread the word!',
    time: '5 hours ago',
    amount: '₦300,000'
  },
  {
    id: '6',
    user: 'Kunle A.',
    comment: 'I love how easy it is to share and earn. I just got my ₦200,000 referral bonus and it reflects immediately.',
    time: 'Just now',
    amount: '₦200,000'
  },
  {
    id: '7',
    user: 'Blessing E.',
    comment: 'The support team is very helpful. They guided me through my first NODE CODE purchase.',
    time: '8 mins ago',
    amount: '₦207,000'
  },
  {
    id: '8',
    user: 'Sadiq W.',
    comment: 'Volerapay is bridging the gap for us. Secure, fast, and exactly what the market needs right now.',
    time: '22 mins ago',
    amount: '₦280,000'
  },
  {
    id: '9',
    user: 'Fatima R.',
    comment: 'Finally, an app that understands the Nigerian banking landscape. Withdrawals are seamless!',
    time: '45 mins ago',
    amount: '₦265,000'
  },
  {
    id: '10',
    user: 'Chijioke K.',
    comment: 'My node investments are growing daily. This is the future of digital wealth in Nigeria.',
    time: '2 hours ago',
    amount: '₦420,000'
  },
  {
    id: '11',
    user: 'Adebayo S.',
    comment: 'Just received my ₦200,000 invite bonus. This app is legit and actually pays!',
    time: '4 hours ago',
    amount: '₦200,000'
  },
  {
    id: '12',
    user: 'Ifeoma U.',
    comment: 'The interface is so clean. I can track every kobo moving through the nodes.',
    time: '6 hours ago',
    amount: '₦295,000'
  },
  {
    id: '13',
    user: 'Musa B.',
    comment: 'Solid engineering. The node tunneling is fast. I recommend Volerapay to all my colleagues.',
    time: '7 hours ago',
    amount: '₦250,000'
  },
  {
    id: '14',
    user: 'Victoria N.',
    comment: 'I was able to withdraw my earnings to PalmPay instantly. No delays at all.',
    time: '9 hours ago',
    amount: '₦230,000'
  },
  {
    id: '15',
    user: 'Tochukwu G.',
    comment: 'Node Code is the way to go. Very secure and highly efficient for high-volume transfers.',
    time: '12 hours ago',
    amount: '₦550,000'
  },
  {
    id: '16',
    user: 'Aisha H.',
    comment: 'Love the AI assistant. It helps me stay on top of my financial targets every single day.',
    time: '15 hours ago',
    amount: '₦220,000'
  },
  {
    id: '17',
    user: 'Damilola F.',
    comment: 'Earning ₦200k just for sharing to WhatsApp? This is the best promo I have seen this year.',
    time: '18 hours ago',
    amount: '₦200,000'
  },
  {
    id: '18',
    user: 'Samuel T.',
    comment: 'Transactions are verified by the node network. I feel very safe keeping my funds here.',
    time: '1 day ago',
    amount: '₦210,000'
  }
];
