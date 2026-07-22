package com.java.projectweb.Controller;

import com.java.projectweb.Entity.Category;
import com.java.projectweb.Service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> lsit() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return  categoryService.findById(id);
    }

    @PostMapping
    public Category create(@RequestBody @Valid Category category) {
        return categoryService.save(category);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody @Valid Category category) {
        Category old = categoryService.findById(id);

        old.setName(category.getName());
        old.setStatus(category.getStatus());

        return categoryService.save(old);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.deleteById(id);
    }
}
