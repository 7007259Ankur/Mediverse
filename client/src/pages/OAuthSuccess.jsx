import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    console.log("OAuth Redirect → token:", token);
    console.log("OAuth Redirect → userParam (encoded):", userParam);

    if (token && userParam) {
      try {
        const decodedUser = decodeURIComponent(userParam);
        const user = JSON.parse(decodedUser);

        console.log("Decoded User Object →", user);

        dispatch(loginSuccess({ token, user }));

        navigate('/patient');
      } catch (err) {
        console.error("Error decoding/parsing user:", err);
        alert("Login failed. Please try again.");
        navigate('/login');
      }
    } else {
      console.error("Missing token or user in OAuth callback URL.");
      alert("Login failed or incomplete. Please login again.");
      navigate('/login');
    }
  }, [dispatch, navigate, searchParams]);

  return <div>Processing login...</div>;
};

export default OAuthSuccess;
