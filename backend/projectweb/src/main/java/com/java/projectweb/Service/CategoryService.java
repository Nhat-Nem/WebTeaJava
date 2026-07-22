package com.java.projectweb.Service;

import com.java.projectweb.Entity.Category;
import com.java.projectweb.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    //lay all
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    //tim theo id
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    //them hoac update
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    //xoa theo id
    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    //kiem tra ton tai
    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }
}
