package com.popflix.model;

public class ReviewDetails {
    private String content;
    private String authorName;
    private String authorUsername;
    private String authorAvatarPath;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getAuthorAvatarPath() {
        return authorAvatarPath;
    }

    public void setAuthorAvatarPath(String authorAvatarPath) {
        this.authorAvatarPath = authorAvatarPath;
    }
}
