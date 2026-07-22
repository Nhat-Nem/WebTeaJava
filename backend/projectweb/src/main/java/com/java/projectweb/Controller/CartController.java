package com.java.projectweb.Controller;

import com.java.projectweb.Entity.Cart;
import com.java.projectweb.Entity.CartItem;
import com.java.projectweb.Entity.Product;
import com.java.projectweb.Entity.User;
import com.java.projectweb.Repository.CartItemRepository;
import com.java.projectweb.Repository.CartRepository;
import com.java.projectweb.Repository.ProductRepository;
import com.java.projectweb.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {


    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;



    @PostMapping
    public ResponseEntity<?> addCart(
            @RequestBody Map<String,Object> data,
            Authentication authentication
    ){

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();



        // lấy cart của user
        Cart cart = cartRepository
                .findByUser(user)
                .orElseGet(() -> {

                    Cart newCart = new Cart();

                    newCart.setUser(user);

                    return cartRepository.save(newCart);
                });



        Long productId =
                Long.parseLong(
                        data.get("productId").toString()
                );


        Product product =
                productRepository.findById(productId)
                        .orElseThrow();



        int quantity = Integer.parseInt(
                data.get("quantity").toString()
        );


        CartItem item = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);


        if(item != null){

            // đã có sản phẩm -> cộng số lượng
            item.setQuantity(
                    item.getQuantity() + quantity
            );

        }else{

            // chưa có -> tạo mới
            item = new CartItem();

            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(product.getPrice());

        }


        cartItemRepository.save(item);



        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Added cart"
                )
        );
    }




    @GetMapping
    public ResponseEntity<?> getCart(
            Authentication authentication
    ){

        User user =
                userRepository.findByEmail(
                        authentication.getName()
                ).orElseThrow();



        Cart cart =
                cartRepository.findByUser(user)
                        .orElseThrow();



        List<CartItem> items =
                cartItemRepository.findByCart(cart);



        return ResponseEntity.ok(
                Map.of(
                        "items",
                        items
                )
        );
    }

    @PutMapping
    public ResponseEntity<?> updateQuantity(
            @RequestBody Map<String,Object> data
    ){

        Long id = Long.parseLong(
                data.get("id").toString()
        );


        String type = data.get("type").toString();


        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();



        if(type.equals("increase")){
            item.setQuantity(
                    item.getQuantity() + 1
            );
        }


        if(type.equals("decrease")){
            if(item.getQuantity() > 1){
                item.setQuantity(
                        item.getQuantity() - 1
                );
            }
        }


        cartItemRepository.save(item);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Updated"
                )
        );
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long id,
            Authentication authentication
    ){

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();


        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();


        // kiểm tra item có thuộc cart user không
        if(!item.getCart().getId().equals(user.getCart().getId())){
            return ResponseEntity
                    .status(403)
                    .body(Map.of(
                            "message",
                            "Not your cart item"
                    ));
        }


        cartItemRepository.delete(item);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Remove success"
                )
        );
    }
}