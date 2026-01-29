package com.ssafy14.a606.global.security.user;

import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Spring Security 표준 진입점
     * username = loginId
     */
    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {

        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found. loginId=" + loginId)
                );

        Long userId = user.getId();
        String role = user.getRole().name();
        String password = user.getPassword();
        if (password == null) password="";

        return new CustomUserDetails(userId, user.getLoginId(), password, role);
    }
}
