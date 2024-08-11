package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QItemMember is a Querydsl query type for ItemMember
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QItemMember extends EntityPathBase<ItemMember> {

    private static final long serialVersionUID = -1154714774L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QItemMember itemMember = new QItemMember("itemMember");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QItem item;

    public final QMember member;

    public QItemMember(String variable) {
        this(ItemMember.class, forVariable(variable), INITS);
    }

    public QItemMember(Path<? extends ItemMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QItemMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QItemMember(PathMetadata metadata, PathInits inits) {
        this(ItemMember.class, metadata, inits);
    }

    public QItemMember(Class<? extends ItemMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.item = inits.isInitialized("item") ? new QItem(forProperty("item"), inits.get("item")) : null;
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member"), inits.get("member")) : null;
    }

}

