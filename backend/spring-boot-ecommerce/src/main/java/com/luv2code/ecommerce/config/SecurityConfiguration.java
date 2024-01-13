 /* Max created on 1/12/2024 inside the package - com.luv2code.ecommerce.config */

 package com.luv2code.ecommerce.config;

 import org.springframework.context.annotation.Bean;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.security.config.annotation.web.builders.HttpSecurity;
 import org.springframework.security.web.SecurityFilterChain;

 @Configuration
 public class SecurityConfiguration {

     @Bean
     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
         http.authorizeHttpRequests(configurer ->
         {
             try {
                 configurer
                         .antMatchers("/api/orders/**")
                         .authenticated()
                         .and().oauth2ResourceServer().jwt();
             } catch (Exception e) {
                 throw new RuntimeException(e);
             }
         });
         http.cors();
         http.csrf().disable();
         return http.build();
     }

 }
