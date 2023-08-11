package click.snekhome.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("players")
public record Player(
        @Id
        String id,
        String userId,
        String name,
        Coordinates coordinates,
        int level,
        int experience,
        int experienceToNextLevel,
        int health,
        int maxHealth,
        int attack,
        int maxAttack,
        int credits,
        long lastScan
) {

}
