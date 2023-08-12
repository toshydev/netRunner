package click.snekhome.backend.model;

import com.google.maps.model.LatLng;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class CustomPlacesResponseTest {

    @Test
    void testEqualsAndHashCode() {
        CustomPlacesResult result1 = new CustomPlacesResult(
                "placeId1",
                new Geometry(new LatLng(1.0, 2.0)),
                "Place 1",
                List.of("type1")
        );

        CustomPlacesResult result2 = new CustomPlacesResult(
                "placeId1",  // Same placeId as result1
                new Geometry(new LatLng(1.0, 2.0)),  // Same location as result1
                "Place 1",  // Same name as result1
                List.of("type1")  // Same types as result1
        );

        CustomPlacesResponse response1 = new CustomPlacesResponse(
                new String[]{"attr1"},
                new CustomPlacesResult[]{result1},
                "OK",
                "token1"
        );

        CustomPlacesResponse response2 = new CustomPlacesResponse(
                new String[]{"attr1"},
                new CustomPlacesResult[]{result2},
                "OK",
                "token1"
        );

        assertEquals(response1, response2);
        assertEquals(response1.hashCode(), response2.hashCode());
    }

    @Test
    void testToString() {
        CustomPlacesResponse response = new CustomPlacesResponse(
                new String[]{"attr1"},
                new CustomPlacesResult[]{},
                "OK",
                "token1"
        );

        String expectedToString = "CustomPlacesResponse{" +
                "html_attributions=[attr1], " +
                "results=[], " +
                "status='OK', " +
                "next_page_token='token1'" +
                "}";

        assertEquals(expectedToString, response.toString());
    }

    @Test
    void testNotEquals() {
        CustomPlacesResponse response1 = new CustomPlacesResponse(
                new String[]{"attr1"},
                new CustomPlacesResult[]{},
                "OK",
                "token1"
        );

        CustomPlacesResponse response2 = new CustomPlacesResponse(
                new String[]{"attr2"},
                new CustomPlacesResult[]{},
                "OK",
                "token2"
        );

        assertNotEquals(response1, response2);
    }

    @Test
    void testNullFields() {
        CustomPlacesResponse response1 = new CustomPlacesResponse(
                null,
                new CustomPlacesResult[]{},
                "OK",
                "token1"
        );

        CustomPlacesResponse response2 = new CustomPlacesResponse(
                null,
                new CustomPlacesResult[]{},
                "OK",
                "token1"
        );

        assertEquals(response1, response2);
        assertEquals(response1.hashCode(), response2.hashCode());
    }

    @Test
    void testAssertJAssertions() {
        CustomPlacesResponse response1 = new CustomPlacesResponse(
                new String[]{"attr1"},
                new CustomPlacesResult[]{},
                "OK",
                "token1"
        );

        CustomPlacesResponse response2 = new CustomPlacesResponse(
                new String[]{"attr1"},
                new CustomPlacesResult[]{},
                "OK",
                "token1"
        );

        assertThat(response1).isEqualTo(response2);
    }
}
