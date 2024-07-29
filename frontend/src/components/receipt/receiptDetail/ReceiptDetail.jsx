
import React from 'react';
import './ReceiptDetail.css';
import { useLocation, useParams } from 'react-router-dom';
import BackButton from '../../common/BackButton';

function ReceiptDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { meetingId, scheduleId } = location.state || {};
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
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}개</td>
                  <td>{item.price.toLocaleString()}원</td>
                  <td className='tagged-people'>
                    {item.taggedPeople.map((person, idx) => (
                      // <img key={idx} src={person.avatar} alt={person.name} className="tagged-avatar" />
                      <div key={idx} className="tagged-avatar">{person.name}</div>
                    ))}
                  </td>
                </tr>
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
        {/* <div className="payment-info">
          <table className="payment-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>정산액</th>
              </tr>
            </thead>
            <tbody>
              {receipt.paymentDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.name}</td>
                  <td>{detail.amount.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </>
  )
}

export default ReceiptDetail;