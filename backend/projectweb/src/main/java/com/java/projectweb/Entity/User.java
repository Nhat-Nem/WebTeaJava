package com.java.projectweb.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.java.projectweb.Entity.Role;
import java.util.List;
import lombok.Data;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @NotBlank(message = "Full name must not be empty")
    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email must not be empty")
    @Column(name = "Email", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @NotBlank(message = "Password must not be empty")
    @Column(name = "Password", nullable = false)
    private String password;

    @NotBlank(message = "Phone must not be empty")
    @Column(name = "Phone")
    private String phone;

    @Temporal(TemporalType.DATE)
    @Column(name = "Birthday")
    private Date birthday;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private Role role = Role.USER;

    @Column(name = "Active")
    private Boolean active = true;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> addresses;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    @Column(name = "ResetPasswordToken")
    private String resetPasswordToken;

    @Column(name = "ResetPasswordExpire")
    @Temporal(TemporalType.TIMESTAMP)
    private Date resetPasswordExpire;
}