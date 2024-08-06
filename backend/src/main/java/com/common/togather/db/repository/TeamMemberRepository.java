package com.common.togather.db.repository;

import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Team;
import com.common.togather.db.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
    // 유저가 속한 TeamMember 리스트 반환
    List<TeamMember> findByMember(Member member);
    // member와 team으로 TeamMember 존재 여부 확인
    boolean existsByMemberAndTeam(Member member, Team team);
    // member와 team으로 TeamMember 조회
    TeamMember findByMemberAndTeam(Member member, Team team);
    // teamId로 TeamMember 리스트 반환
    List<TeamMember> findByTeamId(Integer teamId);
    // 팀과 멤버로 팀 멤버 삭제
    void deleteByMemberAndTeam(Member member, Team team);
}
