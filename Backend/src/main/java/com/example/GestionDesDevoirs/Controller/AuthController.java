package com.example.GestionDesDevoirs.Controller;

import com.example.GestionDesDevoirs.DTO.*;
import com.example.GestionDesDevoirs.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Enables frontend access
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Existing register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.ok().body(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }


    // Existing login endpoint
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateUserRequest request) {
        System.out.println("Received full_name: " + request.getName());
        System.out.println("Received email: " + request.getEmail());

        boolean isUpdated = userService.updateUserProfile(request);

        if (isUpdated) {
            return ResponseEntity.ok().body("Profile updated successfully");
        } else {
            return ResponseEntity.status(400).body("Failed to update profile");
        }
    }

    // New endpoint for changing password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        boolean isPasswordUpdated = userService.changePassword(request);

        if (isPasswordUpdated) {
            return ResponseEntity.ok().body(Map.of("message", "Password updated successfully"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid current password"));
        }
    }
}
