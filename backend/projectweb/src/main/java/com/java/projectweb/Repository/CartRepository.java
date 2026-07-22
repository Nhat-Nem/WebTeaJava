package com.java.projectweb.Repository;

import com.java.projectweb.Entity.Cart;
import com.java.projectweb.Entity.CartItem;
import com.java.projectweb.Entity.Product;
import com.java.projectweb.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository
        extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);

}