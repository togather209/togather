import './NoPayment.css'
function NoPayment() {
  return (
    <div className="noPayment-container">
        <h3 className='noPayment-title'>등록된 Pay계좌가 없습니다.</h3>
        <p className='noPayment-content'>지금 바로 Pay계좌를 생성해보세요!</p>
        <button className="create-payment-button"> + Pay 생성 </button>
    </div>
  );
}

export default NoPayment;
