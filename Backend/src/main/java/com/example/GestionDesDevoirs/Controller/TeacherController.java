package com.example.GestionDesDevoirs.Controller;

import com.example.GestionDesDevoirs.DTO.TeacherDashboardDTO;
import com.example.GestionDesDevoirs.JwtService;
import com.example.GestionDesDevoirs.Repository.UserRepository;
import com.example.GestionDesDevoirs.Entity.User;
import com.example.GestionDesDevoirs.Service.TeacherService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<TeacherDashboardDTO> getDashboard(HttpServletRequest request) {
        // Extract JWT token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        // Find teacher by email
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Use ID to fetch dashboard data
        TeacherDashboardDTO dashboardDTO = teacherService.getDashboardData(teacher.getId());
        return ResponseEntity.ok(dashboardDTO);
    }
}
