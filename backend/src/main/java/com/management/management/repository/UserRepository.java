package com.management.management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import com.management.management.entity.User;
import org.springframework.data.domain.Page;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Page<User> findByUsernameContainingOrEmailContaining(String username, String email, Pageable pageable);

    // Kiểm tra xem username đã tồn tại chưa (Phục vụ cho Register)
    boolean existsByUsername(String username);

    // Kiểm tra xem email đã tồn tại chưa (Nếu bạn muốn kiểm tra trùng email)
    boolean existsByEmail(String email);

}
