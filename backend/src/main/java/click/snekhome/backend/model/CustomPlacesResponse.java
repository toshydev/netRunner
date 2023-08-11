package click.snekhome.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CustomPlacesResponse (
    String[] html_attributions,
    CustomPlacesResult[] results,
    String status,
    String next_page_token)
{
}
