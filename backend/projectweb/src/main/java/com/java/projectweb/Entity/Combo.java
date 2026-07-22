package com.java.projectweb.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "Combos")
public class Combo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Combo name must not be empty")
    private String name;

    private String description;

    // Giá bán của combo
    private Double comboPrice;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    private Boolean active = true;

    @OneToMany(mappedBy = "combo", cascade = CascadeType.ALL)
    private List<ComboDetail> comboDetails;
}