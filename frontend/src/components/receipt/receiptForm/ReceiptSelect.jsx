import React from "react";
import styles from './Receipt.module.css';

import Sky from '../../../assets/receipt/skyBackground.png';
import Pink from '../../../assets/receipt/pinkBackground.png'
import Yellow from '../../../assets/receipt/yellowBackground.png';

function ReceiptSelect({setLocalReceiptColor}) {
  return (
    <>
      <div className={styles['subpic-container']}>

        <div className={styles.subpic} onClick={() => setLocalReceiptColor('sky')}>
          <img src={Sky} alt="background" className={styles.background}/>
          <div className={`${styles['receipt-card']} ${styles.sky}`}>
            <h3>장소명</h3>
            <hr/>
            <p>총액</p>
            <p className={styles.amount}>1,000원</p>
            <hr />
            <p className={styles.date}>일시 : 24.08.16</p>
          </div>
        </div>

        <div className={styles.subpic} onClick={() => setLocalReceiptColor('pink')}>
          <img src={Pink} alt="background" className={styles.background}/>
          <div className={`${styles['receipt-card']} ${styles.pink}`}>
            <h3>장소명</h3>
            <hr className={styles['pink-line']} />
            <p>총액</p>
            <p className={styles.amount}>1,000원</p>
            <p className={styles.date}>일시 : 24.08.16</p>
          </div>
        </div>

        <div className={styles.subpic} onClick={() => setLocalReceiptColor('yellow')}>
          <img src={Yellow} alt="background" className={styles.background}/>
          <div className={`${styles['receipt-card']} ${styles.yellow}`}>
            <h3>장소명</h3>
            <hr />
            <p>총액</p>
            <p className={styles.amount}>1,000원</p>
            <hr />
            <p className={styles.date}>일시 : 24.08.16</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReceiptSelect;