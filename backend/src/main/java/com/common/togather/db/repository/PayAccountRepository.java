package com.common.togather.db.repository;

import com.common.togather.db.entity.PayAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PayAccountRepository extends JpaRepository<PayAccount, Integer> {
    // memberId로 Pay 계좌 찾기
    Optional<PayAccount> findByMemberId(int memberId);
}