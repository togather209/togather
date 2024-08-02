package com.common.togather.db.repository;

import com.common.togather.db.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    // payAccountId로 모든 거래 내역을 조회
    List<Transaction> findByPayAccountId(int payAccountId);

}
