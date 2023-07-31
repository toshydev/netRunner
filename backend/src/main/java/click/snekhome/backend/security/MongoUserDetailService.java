package click.snekhome.backend.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class MongoUserDetailService implements UserDetailsService {

    private final MongoUserRepository mongoUserRepository;

    public MongoUserDetailService(MongoUserRepository mongoUserRepository) {
        this.mongoUserRepository = mongoUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));

        return new User(mongoUser.username(), mongoUser.passwordHash(), Collections.emptyList());
    }

    public UserData getUserData(String username) {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));

        return new UserData(mongoUser.id(), mongoUser.username());
    }

    public MongoUser getUserByUsername(String username) {
        return this.mongoUserRepository.findByUsername(username).orElseThrow();
    }

    public UserData getUserDataById(String id) {
        MongoUser mongoUser = mongoUserRepository.findByid(id)
                .orElseThrow(() -> new UsernameNotFoundException("User with ID " + id + " not found!"));

        return new UserData(mongoUser.id(), mongoUser.username());
    }
}
