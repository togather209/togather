package com.common.togather.db.repository;

import com.common.togather.db.entity.PaymentApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentApprovalRepository extends JpaRepository<PaymentApproval, Integer> {

    Optional<PaymentApproval> findByMemberEmailAndPlanId(String email, int plan);

    void deleteAllByPlanId(int planId);
}
