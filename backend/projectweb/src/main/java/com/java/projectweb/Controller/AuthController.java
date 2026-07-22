package com.java.projectweb.Controller;

import com.java.projectweb.DTO.LoginRequest;
import com.java.projectweb.DTO.RegisterRequest;
import com.java.projectweb.Entity.Cart;
import com.java.projectweb.Entity.Role;
import com.java.projectweb.Entity.User;
import com.java.projectweb.Repository.UserRepository;
import com.java.projectweb.Service.AuthService;
import com.java.projectweb.Service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(
            @RequestBody LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);


        if(user == null){
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message","Email không hợp lệ"
                    ));
        }


        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )){
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message","Sai mật khẩu"
                    ));
        }


        if(user.getRole() != Role.ADMIN){

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Không có quyền truy cập"
                    ));
        }


        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );


        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", user.getRole().name(),
                        "name", user.getFullName()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email không hợp lệ"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Sai mật khẩu"));
        }

        // Chỉ USER được đăng nhập ở frontend khách hàng
        if (user.getRole() != Role.USER) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Vui lòng đăng nhập tại trang quản trị"));
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "name", user.getFullName()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setBirthday(request.getBirthday());

        user.setRole(Role.USER);
        user.setActive(true);


        Cart cart = new Cart();
        cart.setUser(user);

        user.setCart(cart);


        userRepository.save(user);


        return ResponseEntity.ok("Đăng ký thành công");
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {

        boolean exists = userRepository.existsByEmail(email);

        return ResponseEntity.ok(Map.of(
                "email", exists
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    @Autowired
    private AuthService authService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email không hợp lệ"));
        }

        authService.forgotPassword(email);

        return ResponseEntity.ok(
                Map.of("message", "Đã gửi mail reset")
        );
    }

    @PostMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(
            @PathVariable String token,
            @RequestBody Map<String, String> body
    ) {

        authService.resetPassword(token, body.get("password"));

        return ResponseEntity.ok(
                Map.of("message", "Đổi mật khẩu thành công")
        );
    }
}
