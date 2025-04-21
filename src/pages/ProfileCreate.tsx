import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import './ProfileCreate.css';

export const ProfileCreate = () => {
  const navigate = useNavigate();
  const { telegramId, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    car: '',
    description: '',
    photo_url: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!telegramId) {
      setError('Ошибка авторизации в Telegram');
      setIsLoading(false);
      return;
    }

    try {
      const profile = await api.createProfile({
        ...formData,
        age: parseInt(formData.age),
        telegram_id: telegramId
      });
      setUser(profile);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      photo_url: imageUrl
    }));
  };

  return (
    <div className="profile-create">
      <h1 className="profile-create__title">Создание профиля</h1>
      <form className="profile-create__form" onSubmit={handleSubmit}>
        <ImageUpload onImageSelect={handleImageSelect} />
        
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Возраст</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min={18}
            max={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="car">Автомобиль</label>
          <input
            type="text"
            id="car"
            name="car"
            value={formData.car}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={500}
          />
        </div>

        {error && <div className="profile-create__error">{error}</div>}

        <button 
          type="submit" 
          className="profile-create__submit"
          disabled={isLoading || !formData.photo_url}
        >
          {isLoading ? 'Создание...' : 'Создать профиль'}
        </button>
      </form>
    </div>
  );
}; 