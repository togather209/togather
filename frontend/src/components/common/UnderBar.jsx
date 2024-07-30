import './UnderBar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from '../../routes/AppRoutes.jsx';

// import Icons
import MeetingIcon from '../../assets/icons/common/meeting.png';
import MeetingIconActive from '../../assets/icons/common/meeting-active.png';
import GameIcon from '../../assets/icons/common/game.png';
import GameIconActive from '../../assets/icons/common/game-active.png';
import WalletIcon from '../../assets/icons/common/wallet.png';
import WalletIconActive from '../../assets/icons/common/wallet-active.png';
import MyIcon from '../../assets/icons/common/my.png';
import MyIconActive from '../../assets/icons/common/my-active.png';

function UnderBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppRoutes />
      
      <div className='underbar'>
        <button onClick={() => navigate('/')} className={`underbar-button ${isActive('/') ? 'active' : ''}`}>
          <img src={isActive('/') ? MeetingIconActive : MeetingIcon} alt="meeting" className="underbar-icon"/>
          <span>모임</span>
        </button>
        <button onClick={() => navigate('/game')} className={`underbar-button ${isActive('/game') ? 'active' : ''}`}>
          <img src={isActive('/game') ? GameIconActive : GameIcon } alt="game" className="underbar-icon" />
          <span>게임</span>
        </button>
        <button onClick={() => navigate('/wallet')} className={`underbar-button ${isActive('/wallet') ? 'active' : ''}`}>
          <img src={isActive('/wallet') ? WalletIconActive : WalletIcon} alt="wallet" className="underbar-icon" />
          <span>지갑</span>
        </button>
        <button onClick={() => navigate('/mypage')} className={`underbar-button ${isActive('/mypage') ? 'active' : ''}`}>
          <img src={isActive('/mypage') ? MyIconActive : MyIcon} alt="my" className="underbar-icon" />
          <span>마이</span>
        </button>
      </div>
    </>
  ); 
}

export default UnderBar;
