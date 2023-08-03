import { Injectable } from '@angular/core';
import {ProductQuantity} from "../../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  localStorage = window.localStorage;

  getCartProducts() {
    return JSON.parse(this.localStorage.getItem('udacity-my-store-products') || '[]') as ProductQuantity[];
  }

  saveCurrentCart(currentCart: ProductQuantity[]) {
    this.localStorage.setItem('udacity-my-store-products', JSON.stringify(currentCart));
  }
}
