package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPayAccount is a Querydsl query type for PayAccount
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPayAccount extends EntityPathBase<PayAccount> {

    private static final long serialVersionUID = -1819328446L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPayAccount payAccount = new QPayAccount("payAccount");

    public final QAccount account;

    public final StringPath accountName = createString("accountName");

    public final NumberPath<Integer> balance = createNumber("balance", Integer.class);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QMember member;

    public final StringPath password = createString("password");

    public final ListPath<Transaction, QTransaction> transactions = this.<Transaction, QTransaction>createList("transactions", Transaction.class, QTransaction.class, PathInits.DIRECT2);

    public QPayAccount(String variable) {
        this(PayAccount.class, forVariable(variable), INITS);
    }

    public QPayAccount(Path<? extends PayAccount> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPayAccount(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPayAccount(PathMetadata metadata, PathInits inits) {
        this(PayAccount.class, metadata, inits);
    }

    public QPayAccount(Class<? extends PayAccount> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.account = inits.isInitialized("account") ? new QAccount(forProperty("account"), inits.get("account")) : null;
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member"), inits.get("member")) : null;
    }

}

