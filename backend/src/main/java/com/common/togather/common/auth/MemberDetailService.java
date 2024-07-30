package com.common.togather.common.auth;

import com.common.togather.api.service.MemberService;
import com.common.togather.db.entity.Member;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class MemberDetailService implements UserDetailsService {

    private final MemberService memberService;

    public MemberDetailService(MemberService memberService) {
        this.memberService = memberService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberService.getMemberByEmail(email);
        if(member != null){
            MemberDetails memberDetails = new MemberDetails(member);
            return memberDetails;
        }

        return null;
    }
}
