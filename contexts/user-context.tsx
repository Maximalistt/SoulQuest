import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { telegramService, type UserData, type TelegramUser, type Habit, DEFAULT_HABITS } from '../utils/telegram';

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (updates: Partial<UserData>) => void;
  addXP: (amount: number) => void;
  toggleHabit: (habitId: string) => void;
  addCustomHabit: (habit: Omit<Habit, 'id' | 'completed' | 'createdAt'>) => void;
  updateAboutMe: (aboutMe: string) => void;
  updateCustomAvatar: (avatar: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

const STORAGE_KEY = 'soulquest-user-data';

function calculateLevel(xp: number): number {
  // Simple level calculation: level = floor(xp / 100) + 1
  return Math.floor(xp / 100) + 1;
}

function createDefaultUserData(telegramUser: TelegramUser): UserData {
  const defaultHabits: Habit[] = DEFAULT_HABITS.slice(0, 4).map((habit, index) => ({
    ...habit,
    id: `default-${index}`,
    completed: false,
    createdAt: new Date(),
  }));

  return {
    ...telegramUser,
    aboutMe: "Welcome to my mystical journey! I'm on a quest to become the best version of myself through daily challenges and personal growth.",
    xp: 0,
    level: 1,
    customHabits: defaultHabits,
  };
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user data
    const initializeUser = () => {
      try {
        // Try to get Telegram user data
        const telegramUser = telegramService.getUser();
        
        // Load saved user data from localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);
        let userData: UserData;

        if (savedData) {
          const parsed = JSON.parse(savedData);
          // Update with fresh Telegram data if available
          if (telegramUser) {
            userData = {
              ...parsed,
              ...telegramUser,
              customHabits: parsed.customHabits?.map((habit: any) => ({
                ...habit,
                createdAt: new Date(habit.createdAt)
              })) || [],
            };
          } else {
            userData = {
              ...parsed,
              customHabits: parsed.customHabits?.map((habit: any) => ({
                ...habit,
                createdAt: new Date(habit.createdAt)
              })) || [],
            };
          }
        } else {
          // Create new user data
          if (telegramUser) {
            userData = createDefaultUserData(telegramUser);
          } else {
            // Fallback for development/testing
            userData = createDefaultUserData({
              id: 1,
              firstName: 'Emma',
              lastName: 'Mystic',
              username: 'emma_mystic',
            });
          }
        }

        // Recalculate level based on XP
        userData.level = calculateLevel(userData.xp);

        setUser(userData);
        // Save updated data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to initialize user:', error);
        // Fallback user
        const fallbackUser = createDefaultUserData({
          id: 1,
          firstName: 'Emma',
          lastName: 'Mystic',
          username: 'emma_mystic',
        });
        setUser(fallbackUser);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const updateUser = (updates: Partial<UserData>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    if (updates.xp !== undefined) {
      updatedUser.level = calculateLevel(updatedUser.xp);
    }
    
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const addXP = (amount: number) => {
    if (!user) return;

    const newXP = user.xp + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > user.level;

    updateUser({ xp: newXP, level: newLevel });

    // Show level up notification if needed
    if (leveledUp) {
      console.log(`Level up! You are now level ${newLevel}!`);
    }
  };

  const toggleHabit = (habitId: string) => {
    if (!user) return;

    const updatedHabits = user.customHabits.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completed;
        const newCompleted = !wasCompleted;
        
        // Update XP when completing/uncompleting habit
        if (newCompleted && !wasCompleted) {
          addXP(habit.xpReward);
        } else if (!newCompleted && wasCompleted) {
          addXP(-habit.xpReward);
        }

        return { ...habit, completed: newCompleted };
      }
      return habit;
    });

    updateUser({ customHabits: updatedHabits });
  };

  const addCustomHabit = (habitData: Omit<Habit, 'id' | 'completed' | 'createdAt'>) => {
    if (!user) return;

    const newHabit: Habit = {
      ...habitData,
      id: `custom-${Date.now()}`,
      completed: false,
      createdAt: new Date(),
      isCustom: true,
    };

    const updatedHabits = [...user.customHabits, newHabit];
    updateUser({ customHabits: updatedHabits });
  };

  const updateAboutMe = (aboutMe: string) => {
    updateUser({ aboutMe });
  };

  const updateCustomAvatar = (avatar: string | null) => {
    updateUser({ customAvatar: avatar || undefined });
  };

  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    updateUser,
    addXP,
    toggleHabit,
    addCustomHabit,
    updateAboutMe,
    updateCustomAvatar,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}