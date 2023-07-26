package click.snekhome.backend.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record Coordinates(
        @NotNull(message = "Latitude cannot be null")
        @Max(value = 90, message = "Latitude cannot be greater than 90")
        @Min(value = -90, message = "Latitude cannot be less than -90")
        double latitude,
        @NotNull(message = "Longitude cannot be null")
        @Max(value = 180, message = "Longitude cannot be greater than 180")
        @Min(value = -180, message = "Longitude cannot be less than -180")
        double longitude,
        @NotNull(message = "Timestamp cannot be null")
        long timestamp) {
}
