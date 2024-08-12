package com.common.togather.common.fcm;

public enum AlarmType {

    PAYMENT_APPROVAL_REQUEST(
            "최종 정산 동의 요청",
            "'%s' 일정이 끝났습니다 내역을 확인해보세요!",
            1
    ),

    PAYMENT_OBJECTION(
            "최종 정산 이의신청",
            "'%s'님이 '%s' 일정의 정산에 이의신청을 했습니다.",
            2
    ),

    KICK_OUT_NOTIFICATION(
            "모임 추방 알림",
            "'%s' 모임에서 제외되었습니다.",
            3
    ),

    JOIN_REQUEST(
            "모임 가입 신청",
            "'%s'님이 '%s' 모임에 참여하고 싶어합니다.",
            4
    ),

    PAYACOUNT_RECEIVED(
            "입금 알림",
            "'%s'님이 '%s'원을 보냈습니다.",
            5
    ),

    PAYMENT_TRANSFER_REQUEST(
            "최종 정산 송금 요청",
            "'%s' 일정 정산 동의가 완료되었습니다. 최종 정산을 시작해보세요!",
            6
    ),

    JOIN_ACCEPTED(
            "모임 요청 수락 알림",
            "'%s' 모임에 가입되었습니다.",
            7
    ),

    RECEIPT_UPLOADED(
            "영수증 업로드 알림",
            "'%s' 일정에 영수증이 등록되었습니다.",
            8
    ),

    WITHDRAWAL_ALERT(
    "출금 알림",
            "'%s'님에게 '%s'원을 보냈습니다.",
            9
    );

    private final String title;
    private final String message;
    private final Integer type;

    AlarmType(String title, String message) {
        this(title, message, null);
    }

    AlarmType(String title, String message, Integer type) {
        this.title = title;
        this.message = message;
        this.type = type;
    }

    // 제목 반환
    public String getTitle() {
        return title;
    }

    public String getMessage(Object... args) {
        return String.format(message, args);
    }

    public Integer getType() {
        return type;
    }
}