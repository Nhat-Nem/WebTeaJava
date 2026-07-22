package com.java.projectweb.Entity;

import com.java.projectweb.Entity.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "Promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Promotion name must not be empty")
    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @NotNull(message = "Discount must not be null")
    @Min(value = 0, message = "Discount must be >= 0")
    @Max(value = 100, message = "Discount must be <= 100")
    private Integer discount;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Temporal(TemporalType.DATE)
    @NotNull
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @NotNull
    private Date endDate;

    private Boolean active = true;

    @ManyToMany
    @JoinTable(
            name = "Promotion_Product",
            joinColumns = @JoinColumn(name = "PromotionId"),
            inverseJoinColumns = @JoinColumn(name = "ProductId")
    )
    private List<Product> products;
}