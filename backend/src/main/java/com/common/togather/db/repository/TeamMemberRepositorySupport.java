package com.common.togather.db.repository;

import com.common.togather.db.entity.QTeamMember;
import com.common.togather.db.entity.TeamMember;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class TeamMemberRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    QTeamMember qTeamMember = QTeamMember.teamMember;

    public Optional<TeamMember> findMemberInTeamByEmail(Integer teamId, String email) {
        return Optional.ofNullable(jpaQueryFactory
                .select(qTeamMember)
                .from(qTeamMember)
                .where(qTeamMember.team.id.eq(teamId)
                        .and(qTeamMember.member.email.eq(email)))
                .fetchOne());
    }
}
