package com.luv2code.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import com.luv2code.ecommerce.entity.Country;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    private final EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH };

        // disable HTTP methods for classes: PUT, POST, DELETE and PATCH
        disableHTTPMethods(Product.class, config, theUnsupportedActions);
        disableHTTPMethods(ProductCategory.class, config, theUnsupportedActions);
        disableHTTPMethods(State.class, config, theUnsupportedActions);
        disableHTTPMethods(Country.class, config, theUnsupportedActions);
        disableHTTPMethods(Order.class, config, theUnsupportedActions);

        //expose ids
        exposeIds(config);

        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
    }

    private static void disableHTTPMethods(Class theClass, RepositoryRestConfiguration config,
            HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        List<Class> entityClasses = new ArrayList<>();
        entities.forEach(entityType -> entityClasses.add(entityType.getJavaType()));

        Class[] domainTypes = (entityClasses.toArray(new Class[0]));

        config.exposeIdsFor(domainTypes);

    }
}