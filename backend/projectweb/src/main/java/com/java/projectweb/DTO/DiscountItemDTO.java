package com.java.projectweb.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DiscountItemDTO {

    private Long productId;
    private String productName;
    private BigDecimal originalPrice;
    private int quantity;     
    private int percent;
    private BigDecimal discountMoney;

}
