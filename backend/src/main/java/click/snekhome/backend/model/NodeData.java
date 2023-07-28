package click.snekhome.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NodeData(
        @NotBlank(message = "Name cannot be blank")
        @Size(max = 15, message = "Name cannot be longer than 15 characters")
        String name,
        @NotNull(message = "Coordinates cannot be null")
        @Valid
        Coordinates coordinates) {
}
