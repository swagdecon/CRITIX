package com.popflix.model;

import org.bson.types.ObjectId;
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
    private ObjectId mongoId;
    private Integer movieId;
    private Integer userId;
    private Integer reviewRating;
    private String reviewContent;
    private Float kernelRating;
    private Boolean isAccepted;
    private Boolean isRejected;
    private Boolean isInReview;
}
