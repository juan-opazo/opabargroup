import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        router.push('/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
