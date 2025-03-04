import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode, { jwtDecode } from 'jwt-decode';

const withAuth = (WrappedComponent, roles = []) => {
  const WithAuthComponent = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        // If no token is found, redirect to login
        router.push('/login');
        setLoading(false);
      } else {
        try {
          const decodedToken = jwtDecode(token);
          setUser(decodedToken);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          router.push('/login');
          setLoading(false);
        }
      }
    }, [router]);

    if (loading) {
      return <div>Carregando...</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} user={user} />;
  };
    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
