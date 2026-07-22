package com.java.projectweb.Controller;

import com.java.projectweb.Entity.CartItem;
import com.java.projectweb.Entity.Order;
import com.java.projectweb.Entity.User;
import com.java.projectweb.Repository.CartItemRepository;
import com.java.projectweb.Repository.OrderRepository;
import com.java.projectweb.Repository.UserRepository;
import com.java.projectweb.Service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.java.projectweb.DTO.OrderRequest;
import com.java.projectweb.Entity.OrderDetail;
import com.java.projectweb.Entity.Product;
import com.java.projectweb.Repository.ProductRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Order> list() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @PutMapping("/{id}")
    public Order updateStatus(@PathVariable Long id, @RequestBody Order request) {
        return orderService.updateStatus(id, request.getStatus());
    }

    @GetMapping("/revenue")
    public List<Map<String,Object>> revenue(){

        List<Object[]> data = orderRepository.getRevenueByMonth();

        List<Map<String,Object>> result = new ArrayList<>();

        for(Object[] row : data){

            Map<String,Object> map = new HashMap<>();

            map.put("month","T"+row[0]);
            map.put("total",row[1]);

            result.add(map);
        }

        return result;
    }

    @GetMapping("/recent-orders")
    public List<Order> recentOrders(){
        return orderRepository.findTop5ByOrderByOrderDateDesc();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(
            Authentication authentication
    ){

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();


        List<CartItem> items = cartItemRepository.findByCart(user.getCart());


        cartItemRepository.deleteAll(items);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Clear cart success"
                )
        );
    }

    @PostMapping("/")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication
    ){

        // lấy user từ JWT
        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();


        Order order = new Order();

        order.setUser(user);
        order.setStatus("Pending");
        order.setPaymentMethod(request.getPaymentMethod());

        order.setReceiverName(request.getReceiverName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());



        List<OrderDetail> details = new ArrayList<>();


        for(OrderRequest.ItemRequest item : request.getItems()){


            Product product = productRepository
                    .findById(item.getProduct())
                    .orElseThrow();


            OrderDetail detail = new OrderDetail();

            detail.setOrder(order);
            detail.setProduct(product);

            detail.setPrice(item.getPrice());
            detail.setQuantity(item.getQuantity());

            detail.setAmount(
                    item.getPrice() * item.getQuantity()
            );


            details.add(detail);
        }


        order.setOrderDetails(details);


        double total = details.stream()
                .mapToDouble(OrderDetail::getAmount)
                .sum();


        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        // Xóa giỏ hàng
        List<CartItem> items = cartItemRepository.findByCart(user.getCart());
        cartItemRepository.deleteAll(items);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my")
    public ResponseEntity<?> myOrders(Authentication authentication){

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();


        List<Order> orders = orderRepository
                .findByUserOrderByOrderDateDesc(user);


        return ResponseEntity.ok(orders);
    }
}
