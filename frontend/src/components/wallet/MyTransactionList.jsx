import { Link } from "react-router-dom";
import image from "../../assets/icons/common/chunsik.png";
import './MyTransactionList.css';

function MyTransacitionList() {
  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <p className="transaction-title">거래 내역</p>
        <Link to="/wallet/transaction_list" className="view-more">
          더 보기 {">"}
        </Link>
      </div>
      <div className="transaction-list">
        <p className="transaction-date">7.21</p>
        <div className="transaction-item">
          <img src={image} alt="Avatar" className="avatar" />
          <div className="transaction-details">
            <p className="transaction-amount negative">-3,600원</p>
            <p className="transaction-name">이지혜</p>
          </div>
        </div>
        <p className="transaction-date">7.20</p>
        <div className="transaction-item">
          <img src={image} alt="Avatar" className="avatar" />
          <div className="transaction-details">
            <p className="transaction-amount positive">+15,000원</p>
            <p className="transaction-name">나</p>
          </div>
        </div>
        <div className="transaction-item">
          <img src={image} alt="Avatar" className="avatar" />
          <div className="transaction-details">
            <p className="transaction-amount positive">+10,300원</p>
            <p className="transaction-name">김해수</p>
          </div>
        </div>
        <p className="transaction-date">7.18</p>
        <div className="transaction-item">
          <img src={image} alt="Avatar" className="avatar" />
          <div className="transaction-details">
            <p className="transaction-amount negative">- 41,000원</p>
            <p className="transaction-name">김선하</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTransacitionList;
