package com.java.projectweb.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ApplyVoucherRequest {
    private String code;
    private List<CartItemDTO> items;
}
