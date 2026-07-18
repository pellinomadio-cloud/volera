import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where 
} from "firebase/firestore";

export const authService = {
  // Synchronous LocalStorage helpers for fast local state
  getUsersSync: (): any[] => {
    const usersRaw = localStorage.getItem('volerapay_users_list');
    return usersRaw ? JSON.parse(usersRaw) : [];
  },
  
  saveUsersSync: (users: any[]) => {
    localStorage.setItem('volerapay_users_list', JSON.stringify(users));
  },

  // Firestore & Cache synchronized functions
  getUsers: async (): Promise<any[]> => {
    try {
      const usersCol = collection(db, 'users');
      const snapshot = await getDocs(usersCol);
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      if (list.length > 0) {
        authService.saveUsersSync(list);
        return list;
      }
    } catch (err) {
      console.error("Firestore getUsers error:", err);
    }
    return authService.getUsersSync();
  },

  register: async (user: any) => {
    // Save as current user locally
    localStorage.setItem('volerapay_user', JSON.stringify(user));
    
    // Save to the global registered users list locally
    const users = authService.getUsersSync();
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    authService.saveUsersSync(users);

    // Save to Firestore
    try {
      const userDocRef = doc(db, 'users', user.email.toLowerCase());
      await setDoc(userDocRef, {
        username: user.username,
        email: user.email,
        password: user.password,
        balance: user.balance ?? 0.0,
        referrals: user.referrals ?? [],
        createdAt: user.createdAt || new Date().toISOString(),
        level: user.level ?? 1,
        processingMode: user.processingMode ?? false,
        linkingStatus: user.linkingStatus ?? 'none',
        linkingDetails: user.linkingDetails ?? null,
        hasProcessingWithdrawal: user.hasProcessingWithdrawal ?? false
      }, { merge: true });
      console.log("User synced with Firestore successfully");
    } catch (err) {
      console.error("Firestore register sync error:", err);
    }
  },

  login: async (email: string, pass: string) => {
    try {
      const userDocRef = doc(db, 'users', email.toLowerCase());
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.password === pass) {
          const matchedUser = {
            username: data.username,
            email: data.email,
            password: data.password,
            balance: data.balance ?? 0.0,
            referrals: data.referrals ?? [],
            createdAt: data.createdAt || new Date().toISOString(),
            level: data.level ?? 1,
            processingMode: data.processingMode ?? false,
            linkingStatus: data.linkingStatus ?? 'none',
            linkingDetails: data.linkingDetails ?? null,
            hasProcessingWithdrawal: data.hasProcessingWithdrawal ?? false
          };
          localStorage.setItem('volerapay_user', JSON.stringify(matchedUser));
          return matchedUser;
        }
      }
    } catch (err) {
      console.error("Firestore login error, falling back to local storage:", err);
    }

    // Fallback to local storage if Firestore lookup fails/offline
    const users = authService.getUsersSync();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (foundUser) {
      localStorage.setItem('volerapay_user', JSON.stringify(foundUser));
      return foundUser;
    }
    return null;
  },

  updateUsername: async (newName: string) => {
    const savedUser = localStorage.getItem('volerapay_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.username = newName;
      localStorage.setItem('volerapay_user', JSON.stringify(user));
      
      const users = authService.getUsersSync();
      const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (index >= 0) {
        users[index].username = newName;
        authService.saveUsersSync(users);
      }

      // Sync with Firestore
      try {
        const userDocRef = doc(db, 'users', user.email.toLowerCase());
        await setDoc(userDocRef, { username: newName }, { merge: true });
        console.log("Username updated in Firestore");
      } catch (err) {
        console.error("Firestore updateUsername error:", err);
      }
    }
  },

  getCurrentUser: () => {
    const savedUser = localStorage.getItem('volerapay_user');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  logout: () => {
    localStorage.removeItem('volerapay_user');
  },

  // Referral handling via Firebase Firestore
  applyReferral: async (newUsername: string, refCode: string): Promise<boolean> => {
    let referrerUsername = refCode.trim();
    if (referrerUsername.toUpperCase().startsWith('VOLERA-')) {
      referrerUsername = referrerUsername.substring(7).trim();
    }
    if (!referrerUsername) return false;

    try {
      // Find the referrer by username in Firestore case-insensitively
      const usersList = await authService.getUsers();
      const referrerData = usersList.find(u => u.username && u.username.toLowerCase() === referrerUsername.toLowerCase());

      if (referrerData && referrerData.email) {
        const referrals = referrerData.referrals || [];

        if (!referrals.includes(newUsername)) {
          const updatedReferrals = [...referrals, newUsername];
          const updatedBalance = (referrerData.balance || 0) + 10000;

          // Update referrer in Firestore
          const referrerDocRef = doc(db, 'users', referrerData.email.toLowerCase());
          await setDoc(referrerDocRef, {
            referrals: updatedReferrals,
            balance: updatedBalance
          }, { merge: true });

          // Also update in local storage cache
          const localUsers = authService.getUsersSync();
          const localRefIdx = localUsers.findIndex(u => u.email.toLowerCase() === referrerData.email.toLowerCase());
          if (localRefIdx >= 0) {
            localUsers[localRefIdx].referrals = updatedReferrals;
            localUsers[localRefIdx].balance = updatedBalance;
            authService.saveUsersSync(localUsers);
          }

          // If current user is the referrer, update their active session
          const current = authService.getCurrentUser();
          if (current && current.email.toLowerCase() === referrerData.email.toLowerCase()) {
            current.referrals = updatedReferrals;
            current.balance = updatedBalance;
            localStorage.setItem('volerapay_user', JSON.stringify(current));
          }

          return true;
        }
      }
    } catch (err) {
      console.error("Firestore applyReferral error, falling back to local:", err);
    }

    // Fallback to local storage if Firestore fails
    const users = authService.getUsersSync();
    const referrerIndex = users.findIndex(u => u.username && u.username.toLowerCase() === referrerUsername.toLowerCase());
    if (referrerIndex >= 0) {
      const referrer = users[referrerIndex];
      if (!referrer.referrals) referrer.referrals = [];
      
      if (!referrer.referrals.includes(newUsername)) {
        referrer.referrals.push(newUsername);
        referrer.balance = (referrer.balance || 0) + 10000;
        authService.saveUsersSync(users);
        
        const current = authService.getCurrentUser();
        if (current && current.email === referrer.email) {
          localStorage.setItem('volerapay_user', JSON.stringify(referrer));
        }
        return true;
      }
    }
    return false;
  },

  updateUserByAdmin: async (email: string, updates: Record<string, any>) => {
    try {
      const userDocRef = doc(db, 'users', email.toLowerCase());
      await setDoc(userDocRef, updates, { merge: true });
      console.log(`User ${email} updated by admin successfully`);
      
      // Update local storage cache
      const users = authService.getUsersSync();
      const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates };
        authService.saveUsersSync(users);
      }
      
      // If the modified user is the active logged in user, sync their session as well
      const current = authService.getCurrentUser();
      if (current && current.email.toLowerCase() === email.toLowerCase()) {
        const updatedCurrent = { ...current, ...updates };
        localStorage.setItem('volerapay_user', JSON.stringify(updatedCurrent));
      }
      return true;
    } catch (err) {
      console.error("Firestore updateUserByAdmin error:", err);
      return false;
    }
  },

  // App global settings synchronization
  getAppSettingsSync: (): { telegramLink: string; whatsappLink: string; supportTelegramLink: string; bankName: string; accountNumber: string; accountName: string } => {
    const raw = localStorage.getItem('volerapay_app_settings');
    return raw ? JSON.parse(raw) : {
      telegramLink: "https://t.me/novapay999",
      whatsappLink: "https://chat.whatsapp.com/L3gO8z8S5qC6N5uY8L4p2O",
      supportTelegramLink: "https://t.me/novapay999",
      bankName: "Moniepoint Bank",
      accountNumber: "8164299246",
      accountName: "Volerapay Node Ledger Services"
    };
  },

  getAppSettings: async (): Promise<{ telegramLink: string; whatsappLink: string; supportTelegramLink: string; bankName: string; accountNumber: string; accountName: string }> => {
    try {
      const docRef = doc(db, 'settings', 'app');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as any;
        const formatted = {
          telegramLink: data.telegramLink || "https://t.me/novapay999",
          whatsappLink: data.whatsappLink || "https://chat.whatsapp.com/L3gO8z8S5qC6N5uY8L4p2O",
          supportTelegramLink: data.supportTelegramLink || "https://t.me/novapay999",
          bankName: data.bankName || "Moniepoint Bank",
          accountNumber: data.accountNumber || "8164299246",
          accountName: data.accountName || "Volerapay Node Ledger Services"
        };
        localStorage.setItem('volerapay_app_settings', JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.error("Firestore getAppSettings error:", err);
    }
    return authService.getAppSettingsSync();
  },

  updateAppSettings: async (updates: { telegramLink?: string; whatsappLink?: string; supportTelegramLink?: string; bankName?: string; accountNumber?: string; accountName?: string }): Promise<boolean> => {
    try {
      const current = authService.getAppSettingsSync();
      const updated = { ...current, ...updates };
      
      const docRef = doc(db, 'settings', 'app');
      await setDoc(docRef, updated, { merge: true });
      localStorage.setItem('volerapay_app_settings', JSON.stringify(updated));
      console.log("App settings updated successfully in Firestore and cache");
      return true;
    } catch (err) {
      console.error("Firestore updateAppSettings error:", err);
      return false;
    }
  },

  // Upgrade requests local sync
  getUpgradeRequestsSync: (): any[] => {
    const raw = localStorage.getItem('volerapay_upgrade_requests');
    return raw ? JSON.parse(raw) : [];
  },

  // Submit upgrade request
  submitUpgradeRequest: async (request: {
    email: string;
    username: string;
    requestedLevel: number;
    price: number;
    proofBase64: string;
  }): Promise<boolean> => {
    try {
      const requestId = `${request.email.toLowerCase()}_${Date.now()}`;
      const docRef = doc(db, 'upgradeRequests', requestId);
      const reqDoc = {
        id: requestId,
        email: request.email.toLowerCase(),
        username: request.username,
        requestedLevel: request.requestedLevel,
        price: request.price,
        proofBase64: request.proofBase64,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        handledAt: null
      };
      await setDoc(docRef, reqDoc);

      // Save to local storage for offline fallback/caching
      const requests = authService.getUpgradeRequestsSync();
      requests.push(reqDoc);
      localStorage.setItem('volerapay_upgrade_requests', JSON.stringify(requests));
      return true;
    } catch (err) {
      console.error("Firestore submitUpgradeRequest error:", err);
      // Fallback: save to local storage anyway
      try {
        const reqDoc = {
          id: `${request.email.toLowerCase()}_${Date.now()}`,
          email: request.email.toLowerCase(),
          username: request.username,
          requestedLevel: request.requestedLevel,
          price: request.price,
          proofBase64: request.proofBase64,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          handledAt: null
        };
        const requests = authService.getUpgradeRequestsSync();
        requests.push(reqDoc);
        localStorage.setItem('volerapay_upgrade_requests', JSON.stringify(requests));
        return true;
      } catch (e) {
        return false;
      }
    }
  },

  // Get upgrade requests (all, for admin)
  getUpgradeRequests: async (): Promise<any[]> => {
    try {
      const col = collection(db, 'upgradeRequests');
      const snap = await getDocs(col);
      const list: any[] = [];
      snap.forEach((doc) => {
        list.push(doc.data());
      });
      if (list.length > 0) {
        localStorage.setItem('volerapay_upgrade_requests', JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.error("Firestore getUpgradeRequests error:", err);
    }
    return authService.getUpgradeRequestsSync();
  },

  // Update upgrade request status
  updateUpgradeRequestStatus: async (requestId: string, status: 'approved' | 'declined', email: string, requestedLevel: number): Promise<boolean> => {
    try {
      const docRef = doc(db, 'upgradeRequests', requestId);
      const now = new Date().toISOString();
      await setDoc(docRef, { status, handledAt: now }, { merge: true });

      // Update in local cache
      const requests = authService.getUpgradeRequestsSync();
      const idx = requests.findIndex(r => r.id === requestId);
      if (idx >= 0) {
        requests[idx].status = status;
        requests[idx].handledAt = now;
        localStorage.setItem('volerapay_upgrade_requests', JSON.stringify(requests));
      }

      // If approved, update user's level
      if (status === 'approved') {
        const updates: Record<string, any> = { level: requestedLevel };
        if (requestedLevel === 3) {
          updates.processingMode = true;
        }
        await authService.updateUserByAdmin(email, updates);
      }

      return true;
    } catch (err) {
      console.error("Firestore updateUpgradeRequestStatus error, using local fallback:", err);
      // Fallback
      const requests = authService.getUpgradeRequestsSync();
      const idx = requests.findIndex(r => r.id === requestId);
      if (idx >= 0) {
        requests[idx].status = status;
        requests[idx].handledAt = new Date().toISOString();
        localStorage.setItem('volerapay_upgrade_requests', JSON.stringify(requests));
        if (status === 'approved') {
          const updates: Record<string, any> = { level: requestedLevel };
          if (requestedLevel === 3) {
            updates.processingMode = true;
          }
          await authService.updateUserByAdmin(email, updates);
        }
        return true;
      }
      return false;
    }
  },

  // Fetch active pending upgrade request (submitted less than 24 hours ago)
  getActivePendingUpgradeRequest: async (email: string): Promise<any | null> => {
    const requests = await authService.getUpgradeRequests();
    const userPending = requests.filter(r => r.email.toLowerCase() === email.toLowerCase() && r.status === 'pending');
    
    if (userPending.length === 0) return null;

    // Sort by submittedAt descending to find the latest
    userPending.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const latestPending = userPending[0];

    // Check if it's within 24 hours
    const submittedTime = new Date(latestPending.submittedAt).getTime();
    const currentTime = Date.now();
    const diffHours = (currentTime - submittedTime) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return latestPending;
    }
    return null;
  },

  // Deposit handling via Firebase Firestore & localStorage
  getDepositsSync: (): any[] => {
    const raw = localStorage.getItem('volerapay_deposit_requests');
    return raw ? JSON.parse(raw) : [];
  },

  submitDepositRequest: async (request: {
    email: string;
    username: string;
    amount: number;
    proofBase64: string;
  }): Promise<boolean> => {
    try {
      const requestId = `dep_${request.email.toLowerCase()}_${Date.now()}`;
      const docRef = doc(db, 'depositRequests', requestId);
      const reqDoc = {
        id: requestId,
        email: request.email.toLowerCase(),
        username: request.username,
        amount: request.amount,
        proofBase64: request.proofBase64,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        handledAt: null
      };
      await setDoc(docRef, reqDoc);

      // Save to local storage for caching
      const requests = authService.getDepositsSync();
      requests.push(reqDoc);
      localStorage.setItem('volerapay_deposit_requests', JSON.stringify(requests));
      return true;
    } catch (err) {
      console.error("Firestore submitDepositRequest error:", err);
      // Fallback
      try {
        const reqDoc = {
          id: `dep_${request.email.toLowerCase()}_${Date.now()}`,
          email: request.email.toLowerCase(),
          username: request.username,
          amount: request.amount,
          proofBase64: request.proofBase64,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          handledAt: null
        };
        const requests = authService.getDepositsSync();
        requests.push(reqDoc);
        localStorage.setItem('volerapay_deposit_requests', JSON.stringify(requests));
        return true;
      } catch (e) {
        return false;
      }
    }
  },

  getDepositRequests: async (): Promise<any[]> => {
    try {
      const col = collection(db, 'depositRequests');
      const snap = await getDocs(col);
      const list: any[] = [];
      snap.forEach((doc) => {
        list.push(doc.data());
      });
      if (list.length > 0) {
        localStorage.setItem('volerapay_deposit_requests', JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.error("Firestore getDepositRequests error:", err);
    }
    return authService.getDepositsSync();
  },

  updateDepositRequestStatus: async (requestId: string, status: 'approved' | 'declined', email: string, amount: number): Promise<boolean> => {
    try {
      const docRef = doc(db, 'depositRequests', requestId);
      const now = new Date().toISOString();
      await setDoc(docRef, { status, handledAt: now }, { merge: true });

      // Update in local cache
      const requests = authService.getDepositsSync();
      const idx = requests.findIndex(r => r.id === requestId);
      if (idx >= 0) {
        requests[idx].status = status;
        requests[idx].handledAt = now;
        localStorage.setItem('volerapay_deposit_requests', JSON.stringify(requests));
      }

      // If approved, update user's balance
      if (status === 'approved') {
        const usersList = await authService.getUsers();
        const usr = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
        const currentBalance = usr ? (usr.balance || 0) : 0;
        const newBalance = currentBalance + amount;
        await authService.updateUserByAdmin(email, { balance: newBalance });
      }

      return true;
    } catch (err) {
      console.error("Firestore updateDepositRequestStatus error, using local fallback:", err);
      // Fallback
      const requests = authService.getDepositsSync();
      const idx = requests.findIndex(r => r.id === requestId);
      if (idx >= 0) {
        requests[idx].status = status;
        requests[idx].handledAt = new Date().toISOString();
        localStorage.setItem('volerapay_deposit_requests', JSON.stringify(requests));
        
        if (status === 'approved') {
          const usersList = authService.getUsersSync();
          const usr = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
          const currentBalance = usr ? (usr.balance || 0) : 0;
          const newBalance = currentBalance + amount;
          await authService.updateUserByAdmin(email, { balance: newBalance });
        }
        return true;
      }
      return false;
    }
  },

  getActivePendingDepositRequest: async (email: string): Promise<any | null> => {
    const requests = await authService.getDepositRequests();
    const userPending = requests.filter(r => r.email.toLowerCase() === email.toLowerCase() && r.status === 'pending');
    
    if (userPending.length === 0) return null;

    // Sort by submittedAt descending to find the latest
    userPending.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return userPending[0];
  }
};
