package com.java.projectweb.Service;

import com.java.projectweb.Entity.Order;
import com.java.projectweb.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    //lay all
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    //tim theo id
    public Order findById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    //update status
    public Order updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return null;
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }
}
