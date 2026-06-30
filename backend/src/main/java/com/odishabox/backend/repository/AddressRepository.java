package com.odishabox.backend.repository;

import com.odishabox.backend.model.Address;
import com.odishabox.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
}
