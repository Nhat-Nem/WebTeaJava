package com.java.projectweb.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class ApplyVoucherResponse {

    private BigDecimal discount;
    private BigDecimal discountBase;
    private BigDecimal finalTotal;

    private List<DiscountItemDTO> items;
}
