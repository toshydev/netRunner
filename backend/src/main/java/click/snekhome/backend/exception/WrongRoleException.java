package click.snekhome.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Wrong role!")
public class WrongRoleException extends RuntimeException{
    public WrongRoleException(String message) {
        super(message);
    }
}
