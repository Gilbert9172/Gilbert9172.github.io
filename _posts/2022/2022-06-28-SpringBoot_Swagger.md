---
layout: post
title: Swagger 설정
categories: spring
tags: springBoot
---

## <span style="color:gray">Spring Boot + Swagger(Springdoc)</span>

**Dependency**

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.9</version>
</dependency>
```

<br>

**application-properties**

```txt
springdoc.version=v1.0.0
springdoc.packages-to-scan              = ccom.webiznet.arthive.app.controller
springdoc.swagger-ui.path               = /api-docs
springdoc.api-docs.path                 = /api-docs/json
springdoc.swagger-ui.tags-sorter        = alpha
springdoc.swagger-ui.operations-sorter  = alpha
springdoc.api-docs.groups.enabled       = true
springdoc.cache.disabled                = true
springdoc.default-consumes-media-type   = application/json;charset=UTF-8
springdoc.default-produces-media-type   = application/json;charset=UTF-8
springdoc.paths-to-match                = /user/**, /drive/**
```


<br>

**Config**

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI(@Value("${springdoc.version}") String springDocVersion) {
        Info info = new Info()
                .title("BackEnd_API_SERVER")
                .version(springDocVersion)
                .description("백엔드 API Swagger");

        SecurityScheme securityScheme = new SecurityScheme()
                                    .type(SecurityScheme.Type.HTTP)
                                    .scheme("bearer")
                                    .bearerFormat("JWT")
                                    .description("Authorization");

        Components components = new Components()
                            .addSecuritySchemes("Authorization", securityScheme);

        return new OpenAPI().components(components)
                            .addSecurityItem(new SecurityRequirement().addList("Authorization"))
                            .info(info);
    }
}
```

<br>

**JWT 사용사 제외해야 할 URL**

```java
"/api-docs/json/**",
"/swagger-ui/index.html",
"/swagger-ui/swagger-ui.css",
"/swagger-ui/swagger-ui-bundle.js",
"/swagger-ui/index.css",
"/swagger-ui/swagger-ui-standalone-preset.js",
"/swagger-ui/swagger-initializer.js",
"/swagger-ui/favicon-32x32.png",
"/swagger-ui/favicon-16x16.png",
```
---