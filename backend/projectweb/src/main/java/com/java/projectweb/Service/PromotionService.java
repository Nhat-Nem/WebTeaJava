package com.java.projectweb.Service;

import com.java.projectweb.DTO.ApplyVoucherRequest;
import com.java.projectweb.DTO.ApplyVoucherResponse;
import com.java.projectweb.DTO.CartItemDTO;
import com.java.projectweb.DTO.DiscountItemDTO;
import com.java.projectweb.Entity.Product;
import com.java.projectweb.Entity.Promotion;
import com.java.projectweb.Repository.ProductRepository;
import com.java.projectweb.Repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    public List<Promotion> findAll() {
        return promotionRepository.findAll();
    }

    public Promotion findById(Long id) {
        return promotionRepository.findById(id).orElse(null);
    }

    public Promotion update(Long id, Promotion promotion) {
        promotion.setId(id);
        return promotionRepository.save(promotion);
    }

    public void delete(Long id) {
        promotionRepository.deleteById(id);
    }

    public Promotion save(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public Promotion findByCode(String code) {

        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        Date today = new Date();

        if (!promotion.getActive()) {
            throw new RuntimeException("Voucher đã bị khóa");
        }

        if (today.before(promotion.getStartDate())) {
            throw new RuntimeException("Voucher chưa bắt đầu");
        }

        if (today.after(promotion.getEndDate())) {
            throw new RuntimeException("Voucher đã hết hạn");
        }

        return promotion;
    }

    @Autowired
    private ProductRepository productRepository;

    public ApplyVoucherResponse applyVoucher(ApplyVoucherRequest request) {

        Promotion promotion = findByCode(request.getCode());

        BigDecimal discountBase = BigDecimal.ZERO;

        List<DiscountItemDTO> discountItems = new ArrayList<>();

        for (CartItemDTO item : request.getItems()) {

            Product product = productRepository.findById(item.getProduct())
                    .orElseThrow();

            boolean applicable = promotion.getProducts().stream()
                    .anyMatch(p -> p.getId().equals(product.getId()));

            if (!applicable) {
                continue;
            }

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            BigDecimal itemDiscount = itemTotal
                    .multiply(BigDecimal.valueOf(promotion.getDiscount()))
                    .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

            discountBase = discountBase.add(itemTotal);

            discountItems.add(
                    new DiscountItemDTO(
                            product.getId(),
                            product.getName(),
                            product.getPrice(),          // giá 1 sản phẩm
                            item.getQuantity(),          // quantity
                            promotion.getDiscount(),     // %
                            itemDiscount                 // tiền giảm
                    )
            );
        }

        BigDecimal totalDiscount = discountItems.stream()
                .map(DiscountItemDTO::getDiscountMoney)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal finalTotal = discountBase.subtract(totalDiscount);

        return new ApplyVoucherResponse(
                totalDiscount,
                discountBase,
                finalTotal,
                discountItems
        );
    }
}
