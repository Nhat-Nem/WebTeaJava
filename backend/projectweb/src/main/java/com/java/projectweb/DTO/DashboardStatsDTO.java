package com.java.projectweb.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long products;
    private long users;
    private long orders;
    private Double revenue;
}
