package com.common.togather.db.repository;

import com.common.togather.db.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

//    Optional<Member> findByEmail(String email);

    Member findByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByNickname(String nickname);

}
