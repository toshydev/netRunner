package click.snekhome.backend.model;

import java.util.List;

public record CustomPlacesResponse (
    List<String> html_attributions,
    List<CustomPlacesResult> results,
    String status,
    String next_page_token)
{}
