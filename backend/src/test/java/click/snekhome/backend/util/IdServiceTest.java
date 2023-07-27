package click.snekhome.backend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class IdServiceTest {

    @Test
    void expectGeneratedStringOfLengthGreaterZero() {
        //given
        IdService idService = new IdService();
        //when
        String actual = idService.generateId();
        //then
        assertTrue(actual.length() > 0);
    }
}
