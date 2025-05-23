package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.DTO.*;
import com.example.GestionDesDevoirs.Entity.Role;
import com.example.GestionDesDevoirs.Entity.User;
import com.example.GestionDesDevoirs.JwtService;
import com.example.GestionDesDevoirs.Repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }



        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole()); // Set the enum role

        userRepository.save(user);
    }



    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Fetched User: " + user.getEmail() + ", Role: " + user.getRole() + ", Full Name: " + user.getFullName());
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole().name()))
        );

        // Generate JWT token based on UserDetails
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }
    public boolean updateUserProfile(UpdateUserRequest request) {
        // Get the currently authenticated user
        String email = getAuthenticatedUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the user profile details
        user.setFullName(request.getName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        return true; // Profile successfully updated
    }

    public boolean changePassword(ChangePasswordRequest request) {
        // Extract the username (email) from the token (already handled by security context)
        String email = getAuthenticatedUserEmail();

        // Find the user by email (get the current user)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify the current password matches the stored one
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return false; // Invalid current password
        }

        // Hash and update the new password
        String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedNewPassword);
        userRepository.save(user);

        return true; // Password successfully updated
    }



    // Get the authenticated user's email from the token
    public String getAuthenticatedUserEmail() {
        // Get the current authentication object from SecurityContextHolder
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // If the principal is of type UserDetails, cast it
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            return userDetails.getUsername(); // This should be the email
        } else {
            // Handle case when the principal is not an instance of UserDetails (e.g., a String)
            return null;
        }
    }





}
