import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jsonwebtoken/decode';
// import jwt_decode from 'jwt-decode';
// import jwt_decode from 'jwt-decode';
import api from '@/client/api';
import { useRouter } from 'next/router'; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } else {
      axios.get('http://app-presente-back-service.stage-app-chamada-production.svc.cluster.local:8000/api/usuario', { withCredentials: true })
        .then(response => {
          if (response.data) {
            setUser(response.data);
          }
        })
        .catch(error => {
          console.error('Erro ao verificar sessão:', error);
        });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.usuario.login(username, password, { withCredentials: true });
      if (response.data.JWT) {
        localStorage.setItem('token',response.data.JWT);
        const decoded = jwtDecode(response.data.JWT);
        setUser(decoded);
      }
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    console.log('Logout initiated');
    if (!token) {
      console.error('No JWT token found in localStorage');
      return;
    }

    try {
      const response = await api.usuario.logout(token);
      if (response.status === 200) {
        setUser(null);
        localStorage.removeItem('token');
        console.log('User logged out successfully');
        router.push('/login');
      } else {
        console.log(response.data ? response.data.message : "Resposta inesperada do servidor.");
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
