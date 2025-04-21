import { useState, ChangeEvent } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export const ImageUpload = ({ onImageSelect, currentImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Файл слишком большой. Максимальный размер 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload">
      <div className="image-upload__preview">
        {preview ? (
          <img src={preview} alt="Preview" className="image-upload__image" />
        ) : (
          <div className="image-upload__placeholder">
            <span>Выберите фото автомобиля</span>
          </div>
        )}
      </div>
      <label className="image-upload__button">
        {preview ? 'Изменить фото' : 'Загрузить фото'}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-upload__input"
        />
      </label>
      {error && <div className="image-upload__error">{error}</div>}
    </div>
  );
}; 