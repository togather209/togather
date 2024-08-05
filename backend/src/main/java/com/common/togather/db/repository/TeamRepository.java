package com.common.togather.db.repository;

import com.common.togather.db.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {
    // 코드의 존재 여부 확인
    boolean existsByCode(String code);

    Optional<Team> findById(int id);
}
