package com.common.togather.db.repository;

import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Team;
import com.common.togather.db.entity.TeamJoin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamJoinRepository extends JpaRepository<TeamJoin, Integer>  {
    // member와 team으로 TeamJoin 존재 여부 확인
    boolean existsByMemberAndTeam(Member member, Team team);
}
