package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -1579000585L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMember member = new QMember("member1");

    public final StringPath email = createString("email");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<ItemMember, QItemMember> itemMembers = this.<ItemMember, QItemMember>createList("itemMembers", ItemMember.class, QItemMember.class, PathInits.DIRECT2);

    public final StringPath name = createString("name");

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final QPayAccount payAccount;

    public final ListPath<PaymentApproval, QPaymentApproval> paymentApprovals = this.<PaymentApproval, QPaymentApproval>createList("paymentApprovals", PaymentApproval.class, QPaymentApproval.class, PathInits.DIRECT2);

    public final ListPath<Plan, QPlan> plans = this.<Plan, QPlan>createList("plans", Plan.class, QPlan.class, PathInits.DIRECT2);

    public final StringPath profileImg = createString("profileImg");

    public final ListPath<Receipt, QReceipt> receipts = this.<Receipt, QReceipt>createList("receipts", Receipt.class, QReceipt.class, PathInits.DIRECT2);

    public final ListPath<Payment, QPayment> receivePayments = this.<Payment, QPayment>createList("receivePayments", Payment.class, QPayment.class, PathInits.DIRECT2);

    public final ListPath<Payment, QPayment> sendPayments = this.<Payment, QPayment>createList("sendPayments", Payment.class, QPayment.class, PathInits.DIRECT2);

    public final ListPath<TeamMember, QTeamMember> teamMembers = this.<TeamMember, QTeamMember>createList("teamMembers", TeamMember.class, QTeamMember.class, PathInits.DIRECT2);

    public final NumberPath<Integer> type = createNumber("type", Integer.class);

    public QMember(String variable) {
        this(Member.class, forVariable(variable), INITS);
    }

    public QMember(Path<? extends Member> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMember(PathMetadata metadata, PathInits inits) {
        this(Member.class, metadata, inits);
    }

    public QMember(Class<? extends Member> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.payAccount = inits.isInitialized("payAccount") ? new QPayAccount(forProperty("payAccount"), inits.get("payAccount")) : null;
    }

}

