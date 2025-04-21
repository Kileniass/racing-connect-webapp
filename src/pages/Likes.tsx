import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { Profile } from '../types/api';
import styles from '../styles/Likes.module.css';

export const Likes = () => {
  const { telegramId } = useUser();
  const [matches, setMatches] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      if (!telegramId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getMatches(telegramId);
        setMatches(response.matches);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке совпадений');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [telegramId]);

  if (isLoading) {
    return (
      <div className={styles.likes}>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.likes}>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={styles.likes}>
        <div className={styles.likes__empty}>
          <h2 className={styles['likes__empty-title']}>Пока нет совпадений</h2>
          <p className={styles['likes__empty-text']}>Когда кто-то лайкнет вас, вы увидите их здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.likes}>
      <h1 className="header__title">Совпадения</h1>
      <div className={styles.likes__grid}>
        {matches.map(profile => (
          <div key={profile.id} className={styles['like-card']}>
            <div className={styles['like-card__photo']}>
              <img src={profile.photo_url} alt={profile.name} />
            </div>
            <div className={styles['like-card__info']}>
              <h2 className={styles['like-card__name']}>
                {profile.name}, {profile.age}
              </h2>
              <p className={styles['like-card__car']}>{profile.car}</p>
              <p className={styles['like-card__description']}>{profile.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 