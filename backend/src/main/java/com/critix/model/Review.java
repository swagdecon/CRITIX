package com.critix.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    private String reviewId;

    @DBRef
    private User user;

    private String userId;
    private Integer movieId;
    private String movieTitle;
    private String author;
    private String avatar;
    private String rating;
    private Boolean containsSpoiler;
    private String createdDate;
    private String updatedDate;
    private String content;
}
