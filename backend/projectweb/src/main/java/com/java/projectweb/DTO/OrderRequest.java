package com.java.projectweb.DTO;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    private List<ItemRequest> items;

    private Double totalPrice;

    private String address;

    private String phone;

    private String receiverName;

    private String paymentMethod;


    @Data
    public static class ItemRequest {

        private Long product;

        private String size;

        private Integer quantity;

        private Double price;
    }
}