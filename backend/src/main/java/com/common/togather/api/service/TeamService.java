package com.common.togather.api.service;

import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.error.TeamNotFoundException;
import com.common.togather.api.request.TeamSaveRequest;
import com.common.togather.api.request.TeamUpdateRequest;
import com.common.togather.api.response.TeamSaveResponse;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Team;
import com.common.togather.db.entity.TeamMember;
import com.common.togather.db.repository.MemberRepository;
import com.common.togather.db.repository.TeamMemberRepository;
import com.common.togather.db.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamService {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    // 모임 생성
    public TeamSaveResponse saveTeam(String email, TeamSaveRequest requestDto) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 유저가 존재하지 않습니다."));

        String code;
        do {
            code = generateCode();
        } while (teamRepository.existsByCode(code));

        Team team = Team.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .teamImg(requestDto.getTeamImg())
                .code(code)
                .build();
        teamRepository.save(team);

        teamMemberRepository.save(TeamMember.builder()
                .role(1)
                .team(team)
                .member(member)
                .build());

        return TeamSaveResponse.builder()
                .teamId(team.getId())
                .build();
    }

    // 모임 수정
    public void updateTeam(int teamId, TeamUpdateRequest requestDto) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("해당 모임이 존재하지 않습니다."));

        team.updateTeam(requestDto.getTitle(), requestDto.getDescription(), requestDto.getTeamImg());
        teamRepository.save(team);
    }

    // 랜덤 코드 생성
    public static String generateCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }

}
