package com.java.projectweb.Service;

import com.java.projectweb.Entity.Product;
import com.java.projectweb.Repository.CategoryRepository;
import com.java.projectweb.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.java.projectweb.DTO.ProductPageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    //lay all
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    //coutn prod
    public long countProducts() {
        return productRepository.count();
    }

    //xoa
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    //tim theo id
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    //save
    public Product save(Product product) {
        return productRepository.save(product);
    }

    public ProductPageResponse getByCategory(String slug, int page) {

        Pageable pageable = PageRequest.of(page - 1, 8);

        String categoryName;

        switch (slug) {
            case "tea":
                categoryName = "Trà";
                break;
            case "cake":
                categoryName = "Bánh";
                break;
            default:
                categoryName = slug;
        }

        Page<Product> productPage =
                productRepository.findByCategory_NameIgnoreCase(categoryName, pageable);

        return new ProductPageResponse(
                productPage.getContent(),
                productPage.getTotalPages()
        );
    }

    public List<Product> getRelatedProducts(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        return productRepository.findTop4ByCategory_IdAndIdNot(
                product.getCategory().getId(),
                id
        );
    }

    public ProductPageResponse search(String keyword, int page){

        Pageable pageable = PageRequest.of(page - 1, 8);

        Page<Product> productPage =
                productRepository.findByActiveTrueAndNameContainingIgnoreCase(
                        keyword,
                        pageable
                );

        return new ProductPageResponse(
                productPage.getContent(),
                productPage.getTotalPages()
        );
    }
}
