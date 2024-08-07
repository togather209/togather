package com.common.togather.db.repository;

import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Team;
import com.common.togather.db.entity.TeamJoin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamJoinRepository extends JpaRepository<TeamJoin, Integer>  {
    // member와 team으로 TeamJoin 존재 여부 확인
    boolean existsByMemberAndTeam(Member member, Team team);
    // team으로 TeamJoin 리스트 조회
    List<TeamJoin> findByTeam(Team team);
    // team과 member로 TeamMember 조회
    TeamJoin findByMemberAndTeam(Member member, Team team);
}
