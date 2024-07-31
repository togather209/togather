import { useDispatch } from 'react-redux';
import './App.css';
import UnderBar from "./components/common/UnderBar";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { refreshAccessTokenAsync } from './redux/slices/authSlice';
import { useLocation } from 'react-router-dom';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if(!accessToken){
        await dispatch(refreshAccessTokenAsync());
      }
    };

    checkAndRefreshToken();
  }, [dispatch]);

  return (
    <>
      <UnderBar />
    </>
  );
}

export default App;
