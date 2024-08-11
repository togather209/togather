package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPaymentApproval is a Querydsl query type for PaymentApproval
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPaymentApproval extends EntityPathBase<PaymentApproval> {

    private static final long serialVersionUID = 622795948L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPaymentApproval paymentApproval = new QPaymentApproval("paymentApproval");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QMember member;

    public final QPlan plan;

    public final NumberPath<Integer> status = createNumber("status", Integer.class);

    public QPaymentApproval(String variable) {
        this(PaymentApproval.class, forVariable(variable), INITS);
    }

    public QPaymentApproval(Path<? extends PaymentApproval> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPaymentApproval(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPaymentApproval(PathMetadata metadata, PathInits inits) {
        this(PaymentApproval.class, metadata, inits);
    }

    public QPaymentApproval(Class<? extends PaymentApproval> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member"), inits.get("member")) : null;
        this.plan = inits.isInitialized("plan") ? new QPlan(forProperty("plan"), inits.get("plan")) : null;
    }

}

