package click.snekhome.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        return exception.getAllErrors().get(0).getDefaultMessage();
    }

    @ExceptionHandler({UsernameAlreadyExistsException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public String handleUsernameAlreadyExistsException(UsernameAlreadyExistsException exception) {
        return exception.getMessage();
    }

    @ExceptionHandler({WrongRoleException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public String handleWrongRoleException(WrongRoleException exception) {
        return exception.getMessage();
    }

    @ExceptionHandler({NoSuchPlayerException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNoSuchPlayerException(NoSuchPlayerException exception) {
        return exception.getMessage();
    }

    @ExceptionHandler({AuthenticationException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public String handleAuthenticationException(AuthenticationException exception) {
        return exception.getMessage();
    }
}
