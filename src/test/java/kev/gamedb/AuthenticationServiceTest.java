package kev.gamedb;

import kev.gamedb.dto.AuthenticationRequest;
import kev.gamedb.dto.AuthenticationResponse;
import kev.gamedb.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.USER)
                .build();
    }

    @Test
    void register_ShouldSaveUserAndReturnToken() {
        RegisterRequest request = new RegisterRequest("test@example.com", "password");
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(User.class))).thenReturn("testToken");

        AuthenticationResponse response = authenticationService.register(request);

        verify(repository, times(1)).save(any(User.class));
        assertEquals("testToken", response.getToken());
    }

    @Test
    void authenticate_ShouldVerifyAndReturnToken() {
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("testToken");

        AuthenticationResponse response = authenticationService.authenticate(request);

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertEquals("testToken", response.getToken());
    }

    @Test
    void authenticate_ShouldThrowExceptionIfUserNotFound() {
        AuthenticationRequest request = new AuthenticationRequest("notfound@example.com", "password");
        when(repository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authenticationService.authenticate(request));
    }
}
