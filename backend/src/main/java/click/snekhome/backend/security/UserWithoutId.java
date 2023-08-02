package click.snekhome.backend.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserWithoutId(
        @NotBlank
        @Size(min = 3, max = 25, message = "A length between 3 and 15 characters is mandatory.")
        String username,

        @Email
        String email,

        @NotBlank
        //@Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$", message = "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter and one special character")
        String password
) {
}
