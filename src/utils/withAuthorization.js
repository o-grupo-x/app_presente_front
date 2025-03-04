// // src/utils/withAuthorization.js
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useUser } from '@/contexts/UserContext';

// const withAuthorization = (WrappedComponent, allowedRoles) => {
//   const WithAuthorizationComponent = (props) => {
//     const { user, setUser } = useUser();
//     const router = useRouter();

//     useEffect(() => {
//       if (user && !allowedRoles.includes(user.sub.cargo)) {
//         setUser(null);
//         localStorage.removeItem('token'); 
//         router.push('/login');
//       }
//     }, [user, router,setUser]);

//     if (!user || !allowedRoles.includes(user.sub.cargo)) {
//       return null;
//     }

//     return <WrappedComponent {...props} />;
//   };
//   WithAuthorizationComponent.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

//   return WithAuthorizationComponent;
// };

// export default withAuthorization;
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

const withAuth = (WrappedComponent, roles = []) => {
  const WithAuthComponent = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');

      // If no token is found, we simply proceed without redirecting.
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        // Optionally, you can still redirect here if needed:
        // router.push('/login');
      } finally {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <div>Carregando...</div>;
    }

    // Render the component regardless of user state.
    return <WrappedComponent {...props} user={user} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
};

export default withAuth;
