import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPriceSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  totalQuantitySubject: BehaviorSubject<number> = new BehaviorSubject(0);

  storage: Storage = sessionStorage;

  constructor() {
    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotal();
    }
  }

  addToCart(theCartItem: CartItem) {
    // check if the cart already have the item
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    }
    // check if we found the item in the cart
    alreadyExistsInCart = (existingCartItem != undefined);

    if (alreadyExistsInCart) {
      // @ts-ignore
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotal();
  }

  private computeCartTotal() {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;
    this.cartItems.forEach(currentCartItem => {
      const quantity = currentCartItem.quantity;
      totalPrice += quantity * currentCartItem.unitPrice;
      totalQuantity += quantity;
    })
    // publish the new values ... all subscribers will receive the new data
    this.totalPriceSubject.next(totalPrice);
    this.totalQuantitySubject.next(totalQuantity);

    // log cart data just for debugging purposes
    this.logCartData(totalPrice, totalQuantity);

    // persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;
    if (tempCartItem.quantity == 0) {
      this.remove(tempCartItem);
    }
    this.computeCartTotal();
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1); // remove one cart item
    }
  }

}
