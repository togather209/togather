import React from 'react';
import './ReceiptDetail.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../common/BackButton';
import Button from '../../common/Button'

function ReceiptDetail() {
  // Receipt 상세 조회를 위한 id
  const { id } = useParams();

  const location = useLocation();
  const { meetingId, scheduleId } = location.state || {};

  const navigate = useNavigate();

  // 임시 데이터
  const receipt = {
    id: 1,
    color: 'pink',
    title: '한화 이글스 파크',
    items: [
      {
        name: '1루 입장권',
        quantity: 2,
        price: 13000,
        taggedPeople: [
          {
            id: 'jihye',
            name: '이지혜'
          },
        ]
      },
      {
        name: '1루 입장권',
        quantity: 2,
        price: 13000,
        taggedPeople: [
          {
            id: 'jihye',
            name: '이지혜'
          },
        ]
      },
      {
        name: '3루 입장권',
        quantity: 1,
        price: 15000,
        taggedPeople: [
          {
            id: 'jihye',
            name: '이지혜'
          },
          {
            id: 'beongyu',
            name: '김범규',
          }
        ]
      },
    ],
    date: '2024.07.02',
    hostName : '김범규',
    totalPrice: 63000,
    paymentDate: '2024.07.16',
  };

  // 정산액 계산
  const calculateSettlements = (items) => {
    const settlements = {};

    items.forEach(item => {
      const perPersonAmount = item.price / item.taggedPeople.length;

      item.taggedPeople.forEach(person => {
        if (!settlements[person.name]) {
          settlements[person.name] = 0;
        }
        settlements[person.name] += perPersonAmount;
      });
    });

    return settlements;
  };

  const settlements = calculateSettlements(receipt.items);

  const handleCheck = () => {
    navigate(-1);
  }

  return (
    <>
      <div className={`receipt-detail-container ${receipt.color}`}>
        <header className="receipt-header">
          <BackButton></BackButton>
          <div>영수증 조회</div>
        </header>
        <div className="receipt-info">
          <hr className='detail-line'/>
          <h3>{receipt.title}</h3>
          <hr className='detail-line'/>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>품명</th>
                <th>수량</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.quantity}개</td>
                    <td>{item.price.toLocaleString()}원</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className='tagged-people'>
                      {item.taggedPeople.map((person, idx) => (
                        // <img key={idx} src={person.avatar} alt={person.name} className="tagged-avatar" />
                        <div key={idx} className="tagged-avatar"></div>
                      ))}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <hr className='detail-line'/>
          <div className="receipt-detail-total">
            <span>총액</span>
            <span>{receipt.totalPrice.toLocaleString()}원</span>
          </div>
          <div className="receipt-meta">
            <p>결제자 : {receipt.hostName}</p>
            <p>결제일시 : {receipt.paymentDate}</p>
          </div>
        </div>
        <div className="payment-info">
          <table className="payment-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>정산액</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(settlements).map((name, index) => (
                <tr key={index}>
                  <td>{name}</td>
                  <td>{settlements[name].toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="receipt-detail-check">
          <Button className="detail-confirm-button" type="purple" onClick={handleCheck}>확인</Button>
        </div>
      </div>
    </>
  )
}

export default ReceiptDetail;