package com.java.projectweb.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "Product")
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @NotBlank(message = "Name product must not be empty")
    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Image")
    private String image;

    @NotNull(message = "Quantity must not be null")
    @Column(name = "Quantity")
    private Integer quantity;

    @NotNull(message = "Price must not be null")
    @Column(name = "Price")
    private BigDecimal price;

    @NotBlank(message = "Description must not be empty")
    @Column(name = "Description")
    private String description;

    @Column(name = "Sold")
    private Integer sold = 0;

    @Temporal(TemporalType.DATE)
    @Column(name = "CreateDate")
    private Date createDate;

    @NotNull(message = "Active must not be null")
    @Column(name = "Active")
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryId")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;
}