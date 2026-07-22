package com.java.projectweb.Service;

import com.java.projectweb.Entity.Address;
import com.java.projectweb.Repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<Address> findByUser(Long userId){
        return addressRepository.findByUser_Id(userId);
    }

    public Address save(Address address){
        return addressRepository.save(address);
    }

    public Address findById(Long id){
        return addressRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        addressRepository.deleteById(id);
    }
}