package click.snekhome.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Arrays;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CustomPlacesResponse (
    String[] html_attributions,
    CustomPlacesResult[] results,
    String status,
    String next_page_token)
{
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomPlacesResponse that = (CustomPlacesResponse) o;
        return Arrays.equals(html_attributions, that.html_attributions) && Arrays.equals(results, that.results) && Objects.equals(status, that.status) && Objects.equals(next_page_token, that.next_page_token);
    }

    @Override
    public String toString() {
        return "CustomPlacesResponse{" +
                "html_attributions=" + Arrays.toString(html_attributions) +
                ", results=" + Arrays.toString(results) +
                ", status='" + status + '\'' +
                ", next_page_token='" + next_page_token + '\'' +
                '}';
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(status, next_page_token);
        result = 31 * result + Arrays.hashCode(html_attributions);
        result = 31 * result + Arrays.hashCode(results);
        return result;
    }
}
