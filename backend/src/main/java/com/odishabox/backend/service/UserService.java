package com.odishabox.backend.service;

import com.odishabox.backend.dto.RegisterRequest;
import com.odishabox.backend.model.Address;
import com.odishabox.backend.model.Role;
import com.odishabox.backend.model.User;
import com.odishabox.backend.repository.AddressRepository;
import com.odishabox.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AddressRepository addressRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already in use!");
        }

        User user = new User(
            request.email(),
            passwordEncoder.encode(request.password()),
            request.name(),
            request.phoneNumber(),
            Role.ROLE_USER
        );

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<Address> getUserAddresses(User user) {
        return addressRepository.findByUser(user);
    }

    @Transactional
    public Address addAddress(User user, Address address) {
        address.setUser(user);
        if (address.isDefault()) {
            List<Address> addresses = addressRepository.findByUser(user);
            for (Address a : addresses) {
                if (a.isDefault()) {
                    a.setDefault(false);
                    addressRepository.save(a);
                }
            }
        } else if (addressRepository.findByUser(user).isEmpty()) {
            address.setDefault(true);
        }
        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(User user, Long addressId) {
        addressRepository.findById(addressId).ifPresent(address -> {
            if (address.getUser().getId().equals(user.getId())) {
                addressRepository.delete(address);
            }
        });
    }
}
