package com.common.togather.db.repository;

import com.common.togather.db.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Integer> {
    Optional<List<Alarm>> findAllByMemberId(int memberId);
}
