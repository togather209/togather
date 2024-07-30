import React, { useState } from "react";
import './ReceiptForm.css';

function RecognizeComponent() {
	const [activeType, setActiveType] = useState('paper');

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
			<div className="recognition-section">
				<img src="/path/to/receipt_image.png" alt="Receipt" className="receipt-image"/>
				<button className="recognize-button">
					영수증을 인식해보세요!
				</button>
				<div className="recognize-options">
					<button className="option-button">
						<img src="/path/to/camera_icon.png" alt="Camera"/>
					</button>
					<button className="option-button">
						<img src="/path/to/gallery_icon.png" alt="Gallery"/>
					</button>
				</div>
				<div className="recognized-content">
					<p>인식된 내용이 없어요</p>
					<p>영수증을 인식해 정산을 시작해보세요!</p>
				</div>
			</div>
		</>
	)
}

export default RecognizeComponent;