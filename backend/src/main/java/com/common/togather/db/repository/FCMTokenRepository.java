package com.common.togather.db.repository;

import com.common.togather.db.entity.Alarm;
import com.common.togather.db.entity.FCMToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FCMTokenRepository extends JpaRepository<FCMToken, Integer> {
}
