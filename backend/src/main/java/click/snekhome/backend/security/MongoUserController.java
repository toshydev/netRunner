package click.snekhome.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class MongoUserController {

    private final MongoUserService mongoUserService;

    public MongoUserController(MongoUserService mongoUserService) {
        this.mongoUserService = mongoUserService;
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public String getUserData() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/login")
    public ResponseEntity<String> login() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (username.equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        return ResponseEntity.ok(username);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public void register(@Valid @RequestBody UserWithoutId userWithoutId) {
        this.mongoUserService.registerUser(userWithoutId);
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/logout")
    public void logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, authentication);
    }
}
