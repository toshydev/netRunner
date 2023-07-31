package click.snekhome.backend.security;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public record MongoUser(
        @Id
        String id,
        String username,
        String email,
        String passwordHash,
        Role role
) {
}
