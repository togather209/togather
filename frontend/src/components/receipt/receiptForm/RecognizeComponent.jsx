import React, { useState } from "react";
import './ReceiptForm.css';
import PaperReceipt from '../../../assets/receipt/paperReceipt.png';
import MobileReceipt from '../../../assets/receipt/mobileReceipt.png';

import Camera from '../../../assets/receipt/camera.png';
import Picture from '../../../assets/receipt/picture.png';

function RecognizeComponent({ setActiveTab }) {
	const [activeType, setActiveType] = useState('paper');

	// 임시 인식 데이터
	const tempRecognizedItems = [
		{
			storeName: 'How Cafe',
			// TODO : 추가
		}
	]

	return (
		<>
			<div className="receipt-type">
				<button 
					className={`type-button ${activeType === 'paper' ? 'active' : ''}`}
					onClick={() => {setActiveType('paper')}}
				>
					종이 영수증
				</button>
				<button 
					className={`type-button ${activeType === 'mobile' ? 'active' : ''}`}
					onClick={() => {setActiveType('mobile')}}
				>
					모바일 결제내역
				</button>
			</div>
			<div className="reciept-type-img-container">
				<div 
					className={`receipt-type-img ${activeType === 'paper' ? 'active' : 'unActive'}`} 
					onClick={() => {setActiveType('paper')}}
				>
					<img src={PaperReceipt} alt="paper" />
				</div>
				<div 
					className={`receipt-type-img ${activeType === 'mobile' ? 'active' : 'unActive'}`}
					onClick={() => {setActiveType('mobile')}}
				>
					<img src={MobileReceipt} alt="mobile" />
				</div>
			</div>
			<div className="recognition-section">
				<div className="recognize-options">
					<div className="recognize-badge">
						영수증을 인식해보세요!
					</div>
						<img src={Camera} alt="Camera"/>
						<img src={Picture} alt="Gallery"/>
					</div>
			</div>
			<div className="recognized-content">
				<p>인식된 내용이 없어요</p>
				<p>영수증을 인식해 정산을 시작해보세요!</p>
			</div>
		</>
	)
}

export default RecognizeComponent;