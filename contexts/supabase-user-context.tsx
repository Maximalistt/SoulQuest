import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupabaseAPI, User, UserProfile } from '../utils/supabase/client';

interface SupabaseUserContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  initializeUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
}

const SupabaseUserContext = createContext<SupabaseUserContextType | undefined>(undefined);

export function useSupabaseUser(): SupabaseUserContextType {
  const context = useContext(SupabaseUserContext);
  if (!context) {
    throw new Error('useSupabaseUser must be used within a SupabaseUserProvider');
  }
  return context;
}

interface SupabaseUserProviderProps {
  children: ReactNode;
}

// Generate a simple UUID for development
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function SupabaseUserProvider({ children }: SupabaseUserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInMemoryMode, setIsInMemoryMode] = useState(false);

  // Initialize user from Telegram WebApp
  const initializeUser = async () => {
    try {
      setIsLoading(true);
      
      // Check if we're in Telegram WebApp environment
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Ensure WebApp is ready
        tg.ready();
        tg.expand();
        
        const telegramUser = tg.initDataUnsafe?.user;
        
        if (telegramUser) {
          console.log('Telegram user found:', telegramUser);
          
          try {
            // Try to get existing user from database
            let existingUser = await SupabaseAPI.getUserByTelegramId(telegramUser.id.toString());
            
            if (!existingUser) {
              console.log('Creating new user...');
              // Create new user in database
              const userData = {
                telegram_id: telegramUser.id.toString(),
                username: telegramUser.username || null,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name || null,
                avatar_url: telegramUser.photo_url || null,
                level: 1,
                total_xp: 0,
                streak_days: 0,
              };
              
              existingUser = await SupabaseAPI.createUser(userData);
              console.log('New user created:', existingUser);
            } else {
              console.log('Existing user found:', existingUser);
              
              // Update user info from Telegram if changed
              const updates: Partial<User> = {};
              if (existingUser.first_name !== telegramUser.first_name) {
                updates.first_name = telegramUser.first_name;
              }
              if (existingUser.last_name !== telegramUser.last_name) {
                updates.last_name = telegramUser.last_name || null;
              }
              if (existingUser.username !== telegramUser.username) {
                updates.username = telegramUser.username || null;
              }
              if (telegramUser.photo_url && existingUser.avatar_url !== telegramUser.photo_url) {
                updates.avatar_url = telegramUser.photo_url;
              }
              
              if (Object.keys(updates).length > 0) {
                existingUser = await SupabaseAPI.updateUser(existingUser.id, updates);
                console.log('User updated:', existingUser);
              }
            }
            
            setUser(existingUser);
            
            // Get or create user profile
            try {
              const profile = await SupabaseAPI.getUserProfile(existingUser.id);
              setUserProfile(profile);
              console.log('User profile loaded:', profile);
            } catch (error) {
              console.log('Creating new user profile...');
              // Create profile if it doesn't exist
              const newProfile = await SupabaseAPI.createUserProfile({
                user_id: existingUser.id,
              });
              setUserProfile(newProfile);
              console.log('New user profile created:', newProfile);
            }
          } catch (error) {
            console.error('Database error, falling back to in-memory mode:', error);
            await createInMemoryUser(telegramUser);
          }
        } else {
          console.log('No Telegram user data available');
          // In development or if no user data is available
          await createMockUser();
        }
      } else {
        console.log('Not in Telegram WebApp environment, creating mock user for development');
        // Development mode - create mock user
        await createMockUser();
      }
    } catch (error) {
      console.error('Ошибка инициализации пользователя:', error);
      // Fallback to in-memory mock user on error
      await createInMemoryMockUser();
    } finally {
      setIsLoading(false);
    }
  };

  const createMockUser = async () => {
    try {
      // Use a valid numeric telegram_id for development
      const mockTelegramId = '999999999'; // Valid numeric string
      let mockUser = await SupabaseAPI.getUserByTelegramId(mockTelegramId);
      
      if (!mockUser) {
        const userData = {
          telegram_id: mockTelegramId,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          username: 'testuser',
          avatar_url: null,
          level: 1,
          total_xp: 150,
          streak_days: 3,
        };
        
        mockUser = await SupabaseAPI.createUser(userData);
      }
      
      setUser(mockUser);
      setIsInMemoryMode(false);
      
      // Get or create profile
      try {
        const profile = await SupabaseAPI.getUserProfile(mockUser.id);
        setUserProfile(profile);
      } catch (error) {
        const newProfile = await SupabaseAPI.createUserProfile({
          user_id: mockUser.id,
          bio: 'Это тестовый пользователь для разработки приложения SoulQuest.',
        });
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Ошибка создания mock пользователя:', error);
      
      // Last resort - create in-memory mock user
      await createInMemoryMockUser();
    }
  };

  const createInMemoryUser = async (telegramUser: any) => {
    const inMemoryUser = {
      id: generateUUID(),
      telegram_id: telegramUser.id.toString(),
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name || null,
      username: telegramUser.username || null,
      avatar_url: telegramUser.photo_url || null,
      level: 1,
      total_xp: 0,
      streak_days: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(inMemoryUser);
    setIsInMemoryMode(true);
    
    const inMemoryProfile = {
      id: generateUUID(),
      user_id: inMemoryUser.id,
      bio: null,
      city: null,
      birth_date: null,
      zodiac_sign: null,
      profession: null,
      mbti_type: null,
      human_design_type: null,
      human_design_profile: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUserProfile(inMemoryProfile);
  };

  const createInMemoryMockUser = async () => {
    const mockUser = {
      id: generateUUID(),
      telegram_id: '999999999',
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'testuser',
      avatar_url: null,
      level: 1,
      total_xp: 150,
      streak_days: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setIsInMemoryMode(true);
    
    const mockProfile = {
      id: generateUUID(),
      user_id: mockUser.id,
      bio: 'Это тестовый профиль для разработки.',
      city: null,
      birth_date: null,
      zodiac_sign: null,
      profession: null,
      mbti_type: null,
      human_design_type: null,
      human_design_profile: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUserProfile(mockProfile);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      if (isInMemoryMode) {
        // For in-memory mode, just update local state
        setUser(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
        return;
      }
      
      const updatedUser = await SupabaseAPI.updateUser(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      // Fallback to local update if database fails
      setUser(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    try {
      if (isInMemoryMode) {
        // For in-memory mode, just update local state
        setUserProfile(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
        return;
      }
      
      const updatedProfile = await SupabaseAPI.updateUserProfile(user.id, updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      // Fallback to local update if database fails
      setUserProfile(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;
    
    try {
      await updateUser({ avatar_url: avatarUrl });
    } catch (error) {
      console.error('Ошибка обновления аватара:', error);
      throw error;
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    
    try {
      const newTotalXP = user.total_xp + amount;
      const newLevel = Math.floor(newTotalXP / 100) + 1;
      
      await updateUser({ 
        total_xp: newTotalXP,
        level: newLevel 
      });
    } catch (error) {
      console.error('Ошибка добавления XP:', error);
      throw error;
    }
  };

  const incrementStreak = async () => {
    if (!user) return;
    
    try {
      await updateUser({ streak_days: user.streak_days + 1 });
    } catch (error) {
      console.error('Ошибка обновления серии:', error);
      throw error;
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  const value: SupabaseUserContextType = {
    user,
    userProfile,
    isLoading,
    initializeUser,
    updateUser,
    updateUserProfile,
    updateAvatar,
    addXP,
    incrementStreak,
  };

  return (
    <SupabaseUserContext.Provider value={value}>
      {children}
    </SupabaseUserContext.Provider>
  );
}

// Add Telegram WebApp types to window
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        initData: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
            is_premium?: boolean;
          };
          auth_date?: number;
          hash?: string;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme: 'light' | 'dark';
        viewportHeight: number;
        isExpanded: boolean;
      };
    };
  }
}