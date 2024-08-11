package com.common.togather.db.repository;

import com.common.togather.db.entity.Payment;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p FROM Payment p WHERE p.plan.id = :planId AND p.sender.email = :email")
    List<Payment> findByPlanIdAndSenderEmail(@Param("planId") Integer planId, @Param("email") String email);

    Integer countByPlanId(@Param("planId") Integer planId);
}
