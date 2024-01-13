import {ProductService} from 'src/app/services/product.service';
import {ActivatedRoute} from '@angular/router';
import {Product} from './../../common/product';
import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private router: ActivatedRoute, private productService: ProductService, private cartService: CartService) {
  }

  ngOnInit() {
    // this.router.paramMap.subscribe(() => {
      this.handleProductDetails();
    // })
  }

  handleProductDetails() {
    const productId: number = +this.router.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart() {
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
