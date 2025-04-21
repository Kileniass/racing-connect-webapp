import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '../types/api';
import { api } from '../services/api';

interface UserContextType {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  isLoading: boolean;
  error: string | null;
  telegramId: number | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Получаем данные из Telegram WebApp
        if (window.Telegram?.WebApp) {
          const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
          if (tgUser?.id) {
            setTelegramId(tgUser.id);
            try {
              const userProfile = await api.getProfile(tgUser.id);
              setUser(userProfile);
            } catch (error) {
              // Если профиль не найден, это нормально - значит пользователь новый
              if (error instanceof Error && error.message.includes('404')) {
                setUser(null);
              } else {
                throw error;
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, error, telegramId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 