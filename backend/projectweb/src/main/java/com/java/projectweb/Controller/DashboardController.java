package com.java.projectweb.Controller;

import com.java.projectweb.DTO.DashboardStatsDTO;
import com.java.projectweb.DTO.RevenueDTO;
import com.java.projectweb.Entity.Order;
import com.java.projectweb.Repository.OrderRepository;
import com.java.projectweb.Repository.ProductRepository;
import com.java.projectweb.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {

        long products = productRepository.count();
        long users = userRepository.count();
        long orders = orderRepository.count();

        Double revenue = orderRepository.getTotalRevenue();
        if (revenue == null)
            revenue = 0.0;

        return new DashboardStatsDTO(
                products,
                users,
                orders,
                revenue
        );
    }

    @GetMapping("/revenue")
    public List<RevenueDTO> getRevenue() {

        List<Object[]> data = orderRepository.getRevenueByMonth();

        List<RevenueDTO> result = new ArrayList<>();

        for(Object[] row : data){
            result.add(new RevenueDTO(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).doubleValue()
            ));
        }

        return result;
    }

    @GetMapping("/recent-orders")
    public List<Order> recentOrders(){
        return orderRepository.findTop5ByOrderByOrderDateDesc();
    }
}
