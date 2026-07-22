package com.java.projectweb.Repository;

import com.java.projectweb.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findTop4ByActiveTrueOrderBySoldDesc();

    Page<Product> findByCategory_NameIgnoreCase(
            String name,
            Pageable pageable
    );

    List<Product> findTop4ByCategory_IdAndIdNot(Long categoryId, Long id);

    Page<Product> findByActiveTrueAndNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );
}