package com.common.togather.db.repository;

import com.common.togather.db.entity.Account;
import com.common.togather.db.entity.PayAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
}