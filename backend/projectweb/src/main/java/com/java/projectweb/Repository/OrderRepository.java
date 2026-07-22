package com.java.projectweb.Repository;

import com.java.projectweb.Entity.Order;
import com.java.projectweb.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = 'Completed'
    """)
    Double getTotalRevenue();

    @Query("""
        SELECT MONTH(o.orderDate),
               COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE YEAR(o.orderDate) = YEAR(CURRENT_DATE)
          AND o.status = 'Completed'
        GROUP BY MONTH(o.orderDate)
        ORDER BY MONTH(o.orderDate)
    """)
    List<Object[]> getRevenueByMonth();

    List<Order> findTop5ByOrderByOrderDateDesc();
    List<Order> findByUserOrderByOrderDateDesc(User user);
}