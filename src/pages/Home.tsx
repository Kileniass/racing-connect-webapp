import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { Profile } from '../types/api';
import styles from '../styles/Profile.module.css';

export const Home = () => {
  const navigate = useNavigate();
  const { user, telegramId } = useUser();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNextProfile = async () => {
    if (!telegramId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getNextProfile(telegramId);
      setCurrentProfile(response.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке профиля');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/profile-create');
      return;
    }
    
    loadNextProfile();
  }, [user, telegramId]);

  const handleLike = async () => {
    if (!telegramId || !currentProfile) return;

    try {
      await api.likeProfile(telegramId, currentProfile.id);
      loadNextProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке лайка');
    }
  };

  const handleDislike = async () => {
    if (!telegramId || !currentProfile) return;

    try {
      await api.dislikeProfile(telegramId, currentProfile.id);
      loadNextProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке дизлайка');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.profile}>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className={styles.profile}>
        <div className="empty">
          <h2>Профили закончились</h2>
          <p>Попробуйте зайти позже</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profile__photo}>
        <img src={currentProfile.photo_url} alt={currentProfile.name} />
      </div>
      <div className={styles.profile__info}>
        <h1 className={styles.profile__name}>
          {currentProfile.name}, {currentProfile.age}
        </h1>
        <p className={styles.profile__car}>{currentProfile.car}</p>
        <p className={styles.profile__description}>{currentProfile.description}</p>
      </div>
      <div className={styles.profile__actions}>
        <button 
          className={`${styles['action-button']} ${styles['action-button--dislike']}`}
          onClick={handleDislike}
        >
          <span className="visually-hidden">Дизлайк</span>
        </button>
        <button 
          className={`${styles['action-button']} ${styles['action-button--like']}`}
          onClick={handleLike}
        >
          <span className="visually-hidden">Лайк</span>
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}; 