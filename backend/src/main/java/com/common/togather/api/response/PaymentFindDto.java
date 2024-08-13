package com.common.togather.api.response;

import com.common.togather.db.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class  PaymentFindDto {

    Member receiver;

    int itemId;

    String itemName;

    int price;

    Member sender;
}
