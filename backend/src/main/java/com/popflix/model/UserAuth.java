package com.popflix.model;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuth {
    private Integer emailAuthRequests;
    private Date accountAuthRequestDate;
    private Integer passwordResetRequests;
    private Date passwordResetRequestDate;
    private Integer emailResetRequests;
    private Date emailResetRequestDate;
    private Date lastLoginTime;
}
