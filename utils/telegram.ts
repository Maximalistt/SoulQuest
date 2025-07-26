// Telegram Web App types and utilities
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
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
            is_premium?: boolean;
          };
          auth_date: number;
          hash: string;
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

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  photoUrl?: string;
  isPremium?: boolean;
}

export interface UserData extends TelegramUser {
  customAvatar?: string;
  aboutMe: string;
  xp: number;
  level: number;
  customHabits: Habit[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  completed: boolean;
  isCustom: boolean;
  createdAt: Date;
}

class TelegramService {
  private static instance: TelegramService;
  private webApp: any = null;

  private constructor() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.webApp.ready();
      this.webApp.expand();
    }
  }

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  isAvailable(): boolean {
    return this.webApp !== null;
  }

  getUser(): TelegramUser | null {
    if (!this.webApp?.initDataUnsafe?.user) return null;

    const user = this.webApp.initDataUnsafe.user;
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      photoUrl: user.photo_url,
      isPremium: user.is_premium || false,
    };
  }

  getThemeParams() {
    return this.webApp?.themeParams || {};
  }

  getColorScheme() {
    return this.webApp?.colorScheme || 'dark';
  }

  showMainButton(text: string, callback: () => void) {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.setText(text);
      this.webApp.MainButton.onClick(callback);
      this.webApp.MainButton.show();
    }
  }

  hideMainButton() {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.hide();
    }
  }

  showBackButton(callback: () => void) {
    if (this.webApp?.BackButton) {
      this.webApp.BackButton.onClick(callback);
      this.webApp.BackButton.show();
    }
  }

  hideBackButton() {
    if (this.webApp?.BackButton) {
      this.webApp.BackButton.hide();
    }
  }

  close() {
    if (this.webApp) {
      this.webApp.close();
    }
  }
}

export const telegramService = TelegramService.getInstance();

// Default habits library
export const DEFAULT_HABITS: Omit<Habit, 'id' | 'completed' | 'createdAt'>[] = [
  {
    title: 'Morning Planning',
    description: 'Plan your day ahead',
    icon: '📋',
    xpReward: 25,
    isCustom: false,
  },
  {
    title: 'Morning Exercise',
    description: 'Start your day with movement',
    icon: '🏋️‍♂️',
    xpReward: 50,
    isCustom: false,
  },
  {
    title: 'Meditation',
    description: 'Find inner peace and focus',
    icon: '🧘‍♂️',
    xpReward: 30,
    isCustom: false,
  },
  {
    title: 'Goal Visualization',
    description: 'Visualize your success',
    icon: '🎯',
    xpReward: 40,
    isCustom: false,
  },
  {
    title: 'Reading',
    description: 'Expand your knowledge',
    icon: '📚',
    xpReward: 35,
    isCustom: false,
  },
  {
    title: 'Healthy Eating',
    description: 'Nourish your body',
    icon: '🥗',
    xpReward: 20,
    isCustom: false,
  },
  {
    title: 'Water Intake',
    description: 'Stay hydrated',
    icon: '💧',
    xpReward: 15,
    isCustom: false,
  },
  {
    title: 'Journaling',
    description: 'Reflect on your day',
    icon: '✍️',
    xpReward: 25,
    isCustom: false,
  },
];

export const HABIT_ICONS = [
  '📋', '🏋️‍♂️', '🧘‍♂️', '🎯', '📚', '🥗', '💧', '✍️',
  '⚡', '🌟', '🔥', '💎', '🌙', '☀️', '🎨', '🎵',
  '💪', '🧠', '❤️', '🌱', '🎪', '🎭', '🎲', '🎨',
  '🔮', '⭐', '✨', '🌈', '🦄', '🐉', '🗡️', '🛡️',
];