package com.popflix.model;

import org.springframework.data.annotation.Id;
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

    // private ObjectId mongoId;
    private Integer movieId;
    private String author;
    private String avatar;
    private String rating;
    private String createdDate;
    private String updatedDate;
    private String content;
    // private Boolean isAccepted;
    // private Boolean isRejected;
    // private Boolean isInReview;
}
