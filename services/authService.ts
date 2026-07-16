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
        level: user.level ?? 1
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
            level: data.level ?? 1
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
    const referrerUsername = refCode.replace('VOLERA-', '').trim();
    if (!referrerUsername) return false;

    try {
      // Find the referrer by username in Firestore
      const usersCol = collection(db, 'users');
      const q = query(usersCol, where('username', '==', referrerUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const referrerDoc = querySnapshot.docs[0];
        const referrerData = referrerDoc.data();
        const referrals = referrerData.referrals || [];

        if (!referrals.includes(newUsername)) {
          const updatedReferrals = [...referrals, newUsername];
          const updatedBalance = (referrerData.balance || 0) + 10000;

          // Update referrer in Firestore
          await setDoc(referrerDoc.ref, {
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

  updateUserByAdmin: async (email: string, updates: { balance?: number; level?: number }) => {
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
  }
};
