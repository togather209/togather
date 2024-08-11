package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QItem is a Querydsl query type for Item
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QItem extends EntityPathBase<Item> {

    private static final long serialVersionUID = 1709981872L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QItem item = new QItem("item");

    public final NumberPath<Integer> count = createNumber("count", Integer.class);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<ItemMember, QItemMember> itemMembers = this.<ItemMember, QItemMember>createList("itemMembers", ItemMember.class, QItemMember.class, PathInits.DIRECT2);

    public final StringPath name = createString("name");

    public final QReceipt receipt;

    public final NumberPath<Integer> unitPrice = createNumber("unitPrice", Integer.class);

    public QItem(String variable) {
        this(Item.class, forVariable(variable), INITS);
    }

    public QItem(Path<? extends Item> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QItem(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QItem(PathMetadata metadata, PathInits inits) {
        this(Item.class, metadata, inits);
    }

    public QItem(Class<? extends Item> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.receipt = inits.isInitialized("receipt") ? new QReceipt(forProperty("receipt"), inits.get("receipt")) : null;
    }

}

