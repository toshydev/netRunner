package click.snekhome.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("nodes")
public record Node(
        @Id
        String id,
        String ownerId,
        String name,
        int level,
        int health,
        Coordinates coordinates,
        long lastUpdate,
        long lastAttack) {
}
