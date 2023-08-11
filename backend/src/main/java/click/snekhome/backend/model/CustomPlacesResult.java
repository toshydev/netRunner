package click.snekhome.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true, value = "photos")
public record CustomPlacesResult (
    String placeId,
    Geometry geometry,
    String name,
    List<String> types)
{}
