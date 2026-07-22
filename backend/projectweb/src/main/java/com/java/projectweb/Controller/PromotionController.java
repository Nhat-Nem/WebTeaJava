package com.java.projectweb.Controller;

import com.java.projectweb.DTO.ApplyVoucherRequest;
import com.java.projectweb.DTO.ApplyVoucherResponse;
import com.java.projectweb.Entity.Promotion;
import com.java.projectweb.Service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public List<Promotion> getAll() {
        return promotionService.findAll();
    }

    @GetMapping("/{id}")
    public Promotion getById(@PathVariable Long id) {
        return promotionService.findById(id);
    }

    @PostMapping
    public Promotion create(@RequestBody Promotion promotion) {
        return promotionService.save(promotion);
    }

    @PostMapping("/apply")
    public ApplyVoucherResponse applyVoucher(@RequestBody ApplyVoucherRequest request) {
        return promotionService.applyVoucher(request);
    }

    @PutMapping("/{id}")
    public Promotion update(@PathVariable Long id,
                            @RequestBody Promotion promotion) {
        return promotionService.update(id, promotion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        promotionService.delete(id);
    }

    @GetMapping("/code/{code}")
    public Promotion getByCode(@PathVariable String code) {
        return promotionService.findByCode(code);
    }
}
