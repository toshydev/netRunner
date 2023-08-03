package click.snekhome.backend.security;

import click.snekhome.backend.exception.UsernameAlreadyExistsException;
import click.snekhome.backend.service.PlayerService;
import click.snekhome.backend.util.IdService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MongoUserService {

    private final MongoUserRepository mongoUserRepository;

    private final PlayerService playerService;

    public MongoUserService(MongoUserRepository mongoUserRepository, PlayerService playerService) {
        this.mongoUserRepository = mongoUserRepository;
        this.playerService = playerService;
    }

    public UserData getUserDataByUsername(String username) {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));

        return new UserData(mongoUser.id(), mongoUser.username());
    }

    public MongoUser getUserByUsername(String username) {
        return mongoUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));
    }

    public void registerUser(UserWithoutId newUser) {
        IdService idService = new IdService();
        PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        String encodedPassword = encoder.encode(newUser.password());
        if (this.mongoUserRepository.findByUsername(newUser.username()).isPresent())
            throw new UsernameAlreadyExistsException("User " + newUser.username() + " already exists!");
        MongoUser user = new MongoUser(idService.generateId(), newUser.username(), newUser.email(), encodedPassword, Role.PLAYER);
        this.mongoUserRepository.insert(user);
        UserData userData = new UserData(user.id(), user.username());
        this.playerService.createPlayer(userData);
    }
}
