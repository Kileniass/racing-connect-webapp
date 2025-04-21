import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Home } from './pages/Home';
import { Likes } from './pages/Likes';
import { ProfileCreate } from './pages/ProfileCreate';
import './styles/global.css';

const AppRoutes = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="app__loading">Загрузка...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/profile-create" />} />
      <Route path="/likes" element={user ? <Likes /> : <Navigate to="/profile-create" />} />
      <Route path="/profile-create" element={<ProfileCreate />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <UserProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
