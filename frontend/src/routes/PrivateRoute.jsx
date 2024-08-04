import React from 'react';
import useAccessToken from '../utils/useAccessToken';

const PrivateRoute = ({ element: Component, accessToken, ...rest }) => {
  const token = useAccessToken();
  
  return <Component {...rest} accessToken={token} />;
};

export default PrivateRoute;
