package com.popflix.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    // private ObjectId mongoId;
    private Integer movieId;
    // private Integer userId;
    // @JsonProperty("username")
    private String author;
    private String avatar;
    // @JsonProperty("reviewRating")
    private String rating;
    // @JsonProperty("createdAt")
    private String createdDate;
    private String updatedDate;
    // @JsonProperty("reviewContent")
    private String content;
    // private Boolean isAccepted;
    // private Boolean isRejected;
    // private Boolean isInReview;
}
