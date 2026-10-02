package tests.api;

import api.BaseTest;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

class PostsCommentsApiTest extends BaseTest {

    @Test
    void shouldReturnPostsSuccessfully() {
        getPostsResponse().then().statusCode(200);
    }

    @Test
    void shouldReturnAtLeastOnePost() {
        List<Map<String, Object>> posts = getPostsResponse()
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("posts");

        assertFalse(posts.isEmpty(), "Posts response should include at least one post");
    }

    @Test
    void shouldSelectPostWithValidId() {
        assertTrue(getRandomPostId() > 0, "Selected post id should be a positive number");
    }

    @Test
    void shouldReturnCommentsSuccessfully() {
        getCommentsResponse(getRandomPostId()).then().statusCode(200);
    }

    @Test
    void shouldReturnCommentCountMatchingTotal() {
        Response commentsResponse = getCommentsResponse(getRandomPostId());
        commentsResponse.then().statusCode(200);

        List<Map<String, Object>> comments = commentsResponse.jsonPath().getList("comments");
        int totalComments = commentsResponse.jsonPath().getInt("total");

        assertEquals(totalComments, comments.size(),
                "The number of returned comments must equal the total value");
    }

    @Test
    void shouldReturnCommentsWithPositiveIds() {
        List<Map<String, Object>> comments = getCommentsResponse(getRandomPostId())
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("comments");

        for (Map<String, Object> comment : comments) {
            Number commentId = (Number) comment.get("id");
            assertNotNull(commentId, "Comment id should not be null");
            assertTrue(commentId.intValue() > 0, "Comment id should be a valid positive number");
        }
    }

    @Test
    void shouldReturnCommentsForSelectedPost() {
        int postId = getRandomPostId();
        List<Map<String, Object>> comments = getCommentsResponse(postId)
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("comments");

        for (Map<String, Object> comment : comments) {
            Number commentPostId = (Number) comment.get("postId");
            assertNotNull(commentPostId, "Comment postId should not be null");
            assertEquals(postId, commentPostId.intValue(),
                    "Each comment should belong to the selected post id");
        }
    }

    private Response getPostsResponse() {
        return given()
                .queryParam("limit", 10)
                .when()
                .get("/posts");
    }

    private int getRandomPostId() {
        List<Map<String, Object>> posts = getPostsResponse()
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getList("posts");
        assertFalse(posts.isEmpty(), "Posts response should include at least one post");

        int randomIndex = ThreadLocalRandom.current().nextInt(posts.size());
        Number postId = (Number) posts.get(randomIndex).get("id");
        assertNotNull(postId, "Selected post should contain an id");
        return postId.intValue();
    }

    private Response getCommentsResponse(int postId) {
        return given()
                .when()
                .get("/comments/post/{postId}", postId);
    }
}