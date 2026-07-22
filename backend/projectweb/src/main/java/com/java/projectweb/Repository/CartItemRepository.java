package com.java.projectweb.Repository;

import com.java.projectweb.Entity.Cart;
import com.java.projectweb.Entity.CartItem;
import com.java.projectweb.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {


    List<CartItem> findByCart(Cart cart);
    Optional<CartItem> findByCartAndProduct(
            Cart cart,
            Product product
    );
    void deleteByCart(Cart cart);
}