 /* Max created on 1/10/2024 inside the package - com.luv2code.ecommerce.controller */

 package com.luv2code.ecommerce.controller;

 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.web.bind.annotation.PostMapping;
 import org.springframework.web.bind.annotation.RequestBody;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;

 import com.luv2code.ecommerce.dto.Purchase;
 import com.luv2code.ecommerce.dto.PurchaseResponse;
 import com.luv2code.ecommerce.service.CheckoutService;

 @RestController
 @RequestMapping("/api/checkout")
 public class CheckoutController {

     private final CheckoutService checkoutService;

     @Autowired
     public CheckoutController(CheckoutService checkoutService) {
         this.checkoutService = checkoutService;
     }

     @PostMapping("/purchase")
     public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
         return checkoutService.placeOrder(purchase);
     }
 }
