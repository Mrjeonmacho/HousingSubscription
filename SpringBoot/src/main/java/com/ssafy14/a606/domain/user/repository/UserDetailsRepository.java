package com.ssafy14.a606.domain.user.repository;

import com.ssafy14.a606.domain.user.entity.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
}
