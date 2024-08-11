package com.common.togather.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTeam is a Querydsl query type for Team
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTeam extends EntityPathBase<Team> {

    private static final long serialVersionUID = 1710295034L;

    public static final QTeam team = new QTeam("team");

    public final StringPath code = createString("code");

    public final StringPath description = createString("description");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<Plan, QPlan> plans = this.<Plan, QPlan>createList("plans", Plan.class, QPlan.class, PathInits.DIRECT2);

    public final StringPath teamImg = createString("teamImg");

    public final ListPath<TeamJoin, QTeamJoin> teamJoins = this.<TeamJoin, QTeamJoin>createList("teamJoins", TeamJoin.class, QTeamJoin.class, PathInits.DIRECT2);

    public final ListPath<TeamMember, QTeamMember> teamMembers = this.<TeamMember, QTeamMember>createList("teamMembers", TeamMember.class, QTeamMember.class, PathInits.DIRECT2);

    public final StringPath title = createString("title");

    public QTeam(String variable) {
        super(Team.class, forVariable(variable));
    }

    public QTeam(Path<? extends Team> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTeam(PathMetadata metadata) {
        super(Team.class, metadata);
    }

}

