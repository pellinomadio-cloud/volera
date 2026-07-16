
export const authService = {
  getUsers: (): any[] => {
    const usersRaw = localStorage.getItem('volerapay_users_list');
    return usersRaw ? JSON.parse(usersRaw) : [];
  },
  
  saveUsers: (users: any[]) => {
    localStorage.setItem('volerapay_users_list', JSON.stringify(users));
  },

  register: (user: any) => {
    // Save as current user
    localStorage.setItem('volerapay_user', JSON.stringify(user));
    
    // Save to the global registered users list
    const users = authService.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    authService.saveUsers(users);
  },

  login: (email: string, pass: string) => {
    const users = authService.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      localStorage.setItem('volerapay_user', JSON.stringify(foundUser));
      return foundUser;
    }
    return null;
  },

  updateUsername: (newName: string) => {
    const savedUser = localStorage.getItem('volerapay_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.username = newName;
      localStorage.setItem('volerapay_user', JSON.stringify(user));
      
      const users = authService.getUsers();
      const index = users.findIndex(u => u.email === user.email);
      if (index >= 0) {
        users[index].username = newName;
        authService.saveUsers(users);
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

  // Referral handling
  applyReferral: (newUsername: string, refCode: string) => {
    const users = authService.getUsers();
    // A referral code is based on the username: VOLERA-USERNAME
    const referrerUsername = refCode.replace('VOLERA-', '').trim();
    
    const referrerIndex = users.findIndex(u => u.username && u.username.toLowerCase() === referrerUsername.toLowerCase());
    if (referrerIndex >= 0) {
      const referrer = users[referrerIndex];
      if (!referrer.referrals) referrer.referrals = [];
      
      if (!referrer.referrals.includes(newUsername)) {
        referrer.referrals.push(newUsername);
        referrer.balance = (referrer.balance || 0) + 10000; // Credit ₦10,000 for each invite!
        authService.saveUsers(users);
        
        // Sync current session if the referrer is currently logged in
        const current = authService.getCurrentUser();
        if (current && current.email === referrer.email) {
          localStorage.setItem('volerapay_user', JSON.stringify(referrer));
        }
        return true;
      }
    }
    return false;
  }
};

