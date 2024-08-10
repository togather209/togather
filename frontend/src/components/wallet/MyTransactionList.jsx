import { Link } from "react-router-dom";
import image from "../../assets/icons/common/chunsik.png";
import "./MyTransactionList.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function MyTransactionList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    callTransactionData();
  }, []);

  const callTransactionData = async () => {
    try {
      const response = await axiosInstance.get("/transactions/members/me");
      const transactionData = response.data.data;

      // 데이터를 최신순으로 정렬
      const sortedTransactions = transactionData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // 최대 6개만 선택
      const latestTransactions = sortedTransactions.slice(0, 4);

      // 데이터 가공
      const formattedTransactions = latestTransactions.map((transaction) => {
        const date = new Date(transaction.date);
        const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`; // 월-일 포맷

        const isSender = transaction.status === 0;
        const name = isSender
          ? transaction.senderName
          : transaction.receiverName;
        const amount = isSender
          ? `+ ${transaction.price.toLocaleString()}원`
          : `- ${transaction.price.toLocaleString()}원`;
        const type = isSender ? "positive" : "negative";

        return {
          date: formattedDate,
          name,
          amount,
          type,
        };
      });

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("거래 내역을 불러오는 중 오류 발생:", error);
    }
  };

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <p className="transaction-title">거래 내역</p>
        <Link to="/wallet/transaction_list" className="view-more">
          상세 내역
        </Link>
      </div>   
      <div className="transaction-list">
        {transactions.map((transaction, index) => (
          <div key={index}>
            {index === 0 ||
            transaction.date !== transactions[index - 1].date ? (
              <p className="transaction-date">{transaction.date}</p>
            ) : null}
            <div className="transaction-item">
            <img src={image} alt="Avatar" className="avatar" />
              <div className="transaction-details">
                <div>
                  <p className="transaction-name">{transaction.name}</p>
                  <p className="transaction-type">{transaction.type === "positive" ? "입금" : "송금"}</p>
                </div>
                <p
                className={`transaction-amount ${
                  transaction.amount.startsWith("+") ? "positive" : "negative"
                }`}
              >
                {transaction.amount}
              </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default MyTransactionList;
