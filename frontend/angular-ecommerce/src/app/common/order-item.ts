import {CartItem} from "./cart-item";

export class OrderItem {

  private imageUrl: string;
  private unitPrice: number;
  private quantity: number;
  private productId: string;

  constructor(private cartItem: CartItem) {
    this.quantity = cartItem.quantity;
    this.unitPrice = cartItem.unitPrice;
    this.imageUrl = cartItem.imageUrl;
  }

}
