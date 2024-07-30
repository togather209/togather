package com.common.togather.api.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayAccountRechargeRequest {
    
    // 충전 금액
    private int price;

    /*
    Entity >> Dto
    @Builder
    public PayAccountFindByMemberIdResponse(PayAccount payAccount){
        this.memberName = payAccount.getMember().getName();
        this.accountName = payAccount.getAccountName();
        this.balance = payAccount.getBalance();
    }

    Dto >> Entity
    public PayAccount toEntity() {
        return PayAccount.builder()
                .accountName()
                .name(name)
                .password(Password.builder().password(this.password).build())
                .build();
    }
    */
}
