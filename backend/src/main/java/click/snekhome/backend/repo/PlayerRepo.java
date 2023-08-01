package click.snekhome.backend.repo;

import click.snekhome.backend.model.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepo extends MongoRepository<Player, String> {
    Optional<Player> findPlayerByName(String name);

    Optional<Player> findPlayerByid(String id);
}
