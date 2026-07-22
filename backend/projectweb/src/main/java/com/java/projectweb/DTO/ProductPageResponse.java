package com.java.projectweb.DTO;

import com.java.projectweb.Entity.Product;

import java.util.List;

public class ProductPageResponse {

    private List<Product> products;
    private int totalPages;

    public ProductPageResponse(List<Product> products, int totalPages) {
        this.products = products;
        this.totalPages = totalPages;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}