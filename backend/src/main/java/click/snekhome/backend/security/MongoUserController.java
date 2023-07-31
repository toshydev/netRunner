package click.snekhome.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class MongoUserController {

    private final MongoUserDetailService mongoUserDetailService;

    public MongoUserController(MongoUserDetailService mongoUserDetailService) {
        this.mongoUserDetailService = mongoUserDetailService;
    }

    @GetMapping
    public UserData getUserData() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (!username.equals("anonymousUser")) {
            return this.mongoUserDetailService.getUserData(username);
        }
        return null;
    }

    @GetMapping("{id}")
    public UserData getUserDataById(@PathVariable String id) {
        return this.mongoUserDetailService.getUserDataById(id);
    }

    @PostMapping("/login")
    public String login() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    @PostMapping("/logout")
    public void logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, authentication);
    }
}
