package com.common.togather.db.repository;

import com.common.togather.db.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer> {

    Optional<Plan> findById(int id);

}
