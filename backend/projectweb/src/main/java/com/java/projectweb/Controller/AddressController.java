package com.java.projectweb.Controller;

import com.java.projectweb.Entity.Address;
import com.java.projectweb.Entity.User;
import com.java.projectweb.Repository.UserRepository;
import com.java.projectweb.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email).orElse(null);
    }

    // Lấy danh sách địa chỉ
    @GetMapping
    public ResponseEntity<List<Address>> getAll() {

        User user = getCurrentUser();

        return ResponseEntity.ok(
                addressService.findByUser(user.getId())
        );
    }

    // Thêm địa chỉ
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Address address) {

        User user = getCurrentUser();

        address.setUser(user);

        Address saved = addressService.save(address);

        return ResponseEntity.ok(saved);
    }

    // Cập nhật địa chỉ
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Address data) {

        User user = getCurrentUser();

        Address address = addressService.findById(id);

        if (address == null)
            return ResponseEntity.notFound().build();

        if (!address.getUser().getId().equals(user.getId()))
            return ResponseEntity.status(403).build();

        address.setFullName(data.getFullName());
        address.setPhone(data.getPhone());
        address.setAddress(data.getAddress());
        address.setIsDefault(data.getIsDefault());

        return ResponseEntity.ok(
                addressService.save(address)
        );
    }

    // Xóa địa chỉ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        User user = getCurrentUser();

        Address address = addressService.findById(id);

        if (address == null)
            return ResponseEntity.notFound().build();

        if (!address.getUser().getId().equals(user.getId()))
            return ResponseEntity.status(403).build();

        addressService.delete(id);

        return ResponseEntity.ok().build();
    }

}