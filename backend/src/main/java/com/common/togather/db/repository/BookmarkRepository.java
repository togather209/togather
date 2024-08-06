package com.common.togather.db.repository;

import com.common.togather.db.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Integer> {

   List<Bookmark> findAllByDate(LocalDate date);

}
