package api;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.BeforeAll;

public class BaseTest {
    protected static RequestSpecification requestSpec;

    @BeforeAll
    static void setUp() {
        requestSpec = new RequestSpecBuilder()
                .setBaseUri("https://dummyjson.com")
                .setContentType(ContentType.JSON)
                .build();

        RestAssured.requestSpecification = requestSpec;
    }
}
