package com.java.projectweb.Controller;

import com.java.projectweb.Entity.Category;
import com.java.projectweb.Service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/category")
public class AdminController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("")
    public String list(Model model) {
        model.addAttribute("categories", categoryService.findAll());
        return "admin/category/list";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("category", new Category());
        return "admin/category/form";
    }

    @PostMapping("/save")
    public String save(@Valid @ModelAttribute("category") Category category,
                       BindingResult result) {

        if (result.hasErrors()) {
            return "admin/category/form";
        }

        categoryService.save(category);
        return "redirect:/admin/category";
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {

        Category category = categoryService.findById(id);

        if (category == null) {
            return "redirect:/admin/category";
        }

        model.addAttribute("category", category);
        return "admin/category/form";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {

        categoryService.deleteById(id);

        return "redirect:/admin/category";
    }
}
