package click.snekhome.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.*;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;

import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class MapboxControllerTest {

    @MockBean
    private RestTemplate restTemplate;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DirtiesContext
    @WithMockUser(username = "test")
    void expectImageWithResponseEntity() throws Exception {
        InputStream imageInputStream = getClass().getResourceAsStream("/static/response.png");
        byte[] imageBytes = StreamUtils.copyToByteArray(imageInputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        ResponseEntity<byte[]> mockResponseEntity = new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

        when(restTemplate.getForEntity(
                anyString(),
                eq(byte[].class), any(HttpEntity.class)))
                .thenReturn(mockResponseEntity);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/map/5/0/0"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().bytes(imageBytes))
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE));
    }

}
