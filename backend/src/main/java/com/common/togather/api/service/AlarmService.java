package com.common.togather.api.service;

import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.error.NotFoundAlarmException;
import com.common.togather.api.response.AlarmFindByMemberResponse;
import com.common.togather.db.entity.Alarm;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.AlarmRepository;
import com.common.togather.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;

    public List<AlarmFindByMemberResponse> findAllAlarmByMember(String email) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        List<AlarmFindByMemberResponse> responses = new ArrayList<>();
        List<Alarm> alarms = alarmRepository.findAllByMemberId(member.getId()).get();

        for (Alarm alarm : alarms) {
            responses.add(
                    AlarmFindByMemberResponse.builder()
                            .id(alarm.getId())
                            .title(alarm.getTitle())
                            .content(alarm.getContent())
                            .type(alarm.getType())
                            .build()
            );
        }
        return responses;
    }

    public void DeleteAlarmByAlarmId(String email, int alarmId) {

        int deletedCount = alarmRepository.deleteByIdAndMemberEmail(alarmId, email);

        if (deletedCount == 0) {
            throw new NotFoundAlarmException("해당 알림을 찾을 수 없거나 삭제가 되지 않았습니다.");
        }
    }
}
