package com.java.projectweb.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.io.Serializable;
import java.util.List;


@Data
@Entity
@Table(name="Categories")
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @NotBlank(message = "Name not empty")
    String name;
    @jakarta.validation.constraints.NotNull
    Boolean status;
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    List<Product> products;
}
