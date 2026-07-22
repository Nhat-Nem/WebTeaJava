package com.java.projectweb.Service;

import com.java.projectweb.Entity.User;
import com.java.projectweb.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    //lay all
    public List<User> findAll() {
        return userRepository.findAll();
    }

    //tim theo id
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    //xoa
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
