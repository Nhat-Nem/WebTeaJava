package com.java.projectweb.Controller;

import com.java.projectweb.Entity.Category;
import com.java.projectweb.Entity.Product;
import com.java.projectweb.Repository.CategoryRepository;
import com.java.projectweb.Repository.ProductRepository;
import com.java.projectweb.Service.ProductService;
import com.sun.jdi.PrimitiveValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/products";

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> list() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        Product product = productService.findById(id);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam String name,
            @RequestParam Integer quantity,
            @RequestParam Integer sold,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam boolean active,
            @RequestParam Long category,
            @RequestParam MultipartFile image
            ) {
        try {
            File dir = new File(UPLOAD_DIR);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

            File destination = new File(UPLOAD_DIR + "/" + fileName);

            image.transferTo(destination);

            System.out.println("SAVE TO = " + destination.getAbsolutePath());
            System.out.println("EXISTS = " + destination.exists());
            System.out.println("LENGTH = " + destination.length());

            Category cate = categoryRepository.findById(category).orElse(null);

            Product product = new Product();

            product.setName(name);
            product.setName(name);
            product.setPrice(java.math.BigDecimal.valueOf(price));
            product.setQuantity(quantity);
            product.setSold(sold);
            product.setDescription(description);
            product.setActive(active);
            product.setImage(fileName);
            product.setCategory(cate);
            product.setCreateDate(new Date());

            return ResponseEntity.ok(productService.save(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(

            @PathVariable Long id,

            @RequestParam String name,
            @RequestParam Integer quantity,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam Boolean active,
            @RequestParam Long category,

            @RequestParam(required = false)
            MultipartFile image

    ) {

        try {

            Product product = productService.findById(id);

            if (product == null)
                return ResponseEntity.notFound().build();

            product.setName(name);
            product.setPrice(java.math.BigDecimal.valueOf(price));
            product.setQuantity(quantity);
            product.setDescription(description);
            product.setActive(active);

            Category cate = categoryRepository.findById(category).orElse(null);
            product.setCategory(cate);

            if (image != null && !image.isEmpty()) {

                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

                image.transferTo(new File(UPLOAD_DIR + "/" + fileName));

                product.setImage(fileName);
            }

            return ResponseEntity.ok(productService.save(product));

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        productService.delete(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/top-selling")
    public List<Product> getTopSellingProducts() {
        return productRepository.findTop4ByActiveTrueOrderBySoldDesc();
    }

    @GetMapping("/category/{slug}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "1") int page
    ) {

        return ResponseEntity.ok(productService.getByCategory(slug, page));
    }

    @GetMapping("/related/{id}")
    public ResponseEntity<List<Product>> related(@PathVariable Long id) {

        return ResponseEntity.ok(productService.getRelatedProducts(id));

    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page
    ){

        return ResponseEntity.ok(
                productService.search(keyword, page)
        );
    }
}
