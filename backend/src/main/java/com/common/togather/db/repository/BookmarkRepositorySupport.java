package com.common.togather.db.repository;

import com.common.togather.api.response.BookmarkFindAllByPlanIdResponse;
import com.common.togather.api.response.BookmarkFindAllByPlanIdResponse.PlaceByDate;
import com.common.togather.db.entity.Bookmark;
import com.common.togather.db.entity.QBookmark;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class BookmarkRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    QBookmark qBookmark = QBookmark.bookmark;

    public Optional<List<BookmarkFindAllByPlanIdResponse>> findAllBookmarkByPlanId(int planId) {

        List<Tuple> bookmarkResults = jpaQueryFactory
                .select(
                        formattedDate,
                        qBookmark.id,
                        qBookmark.placeName
                )
                .from(qBookmark)
                .where(qBookmark.plan.id.eq(planId))
                .fetch();

        Map<String, BookmarkFindAllByPlanIdResponse> bookmarkMap = new HashMap<>();

        bookmarkResults.forEach(result -> {
            String bookmarkDate = result.get(formattedDate);

            BookmarkFindAllByPlanIdResponse bookmark = bookmarkMap.computeIfAbsent(bookmarkDate, key -> new BookmarkFindAllByPlanIdResponse(
                    bookmarkDate,
                    new ArrayList<>()
            ));

            PlaceByDate place = new PlaceByDate(
                    result.get(qBookmark.id),
                    result.get(qBookmark.placeName)
            );
            bookmark.getPlaces().add(place);
        });

        return Optional.of(new ArrayList<>(bookmarkMap.values()));
    }

    StringTemplate formattedDate = Expressions.stringTemplate(
            "DATE_FORMAT({0}, {1})",
            qBookmark.date,
            ConstantImpl.create("%Y/%m/%d"));
    
    // 같은 일정 아이디와 같은 장소 아이디를 갖는 북마크 조회
    public Boolean existsSamePlaceInSamePlan(int planId, String placeId) {
        QBookmark qBookmark = QBookmark.bookmark;

        Bookmark result = jpaQueryFactory.selectFrom(qBookmark)
                .where(qBookmark.plan.id.eq(planId)
                        .and(qBookmark.placeId.eq(placeId)))
                .fetchOne();

        // 조회된 북마크가 없다면 false 반환
        if(result == null) return false;

        // 조회된 북마크가 있다면 true 반환
        return true;
    }
}
