package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTeamJoin is a Querydsl query type for TeamJoin
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTeamJoin extends EntityPathBase<TeamJoin> {

    private static final long serialVersionUID = 1979436100L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTeamJoin teamJoin = new QTeamJoin("teamJoin");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QMember member;

    public final NumberPath<Integer> status = createNumber("status", Integer.class);

    public final QTeam team;

    public QTeamJoin(String variable) {
        this(TeamJoin.class, forVariable(variable), INITS);
    }

    public QTeamJoin(Path<? extends TeamJoin> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTeamJoin(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTeamJoin(PathMetadata metadata, PathInits inits) {
        this(TeamJoin.class, metadata, inits);
    }

    public QTeamJoin(Class<? extends TeamJoin> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member"), inits.get("member")) : null;
        this.team = inits.isInitialized("team") ? new QTeam(forProperty("team")) : null;
    }

}

