package click.snekhome.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CustomPlacesResponse (
    List<String> html_attributions,
    List<CustomPlacesResult> results,
    String status,
    String next_page_token)
{}
