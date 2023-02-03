package com.popflix.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Authority {
 @Id
 private Long id;
 private String username;
 private String email;
 private String authority;
}