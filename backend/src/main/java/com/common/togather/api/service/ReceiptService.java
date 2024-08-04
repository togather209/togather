package com.common.togather.api.service;

import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.db.repository.ReceiptRepositorySupport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepositorySupport receiptRepositorySupport;

    public ReceiptFindByReceiptIdResponse findReceiptByReceiptId(String email, int teamId, int receiptId) {

        return receiptRepositorySupport.findReceiptByReceiptId(email, receiptId).orElseThrow();
    }
}
