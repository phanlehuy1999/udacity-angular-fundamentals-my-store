import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {Product, ProductQuantity} from "../../models/product.model";
import {handleError} from "../../utils";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  localStorage = window.localStorage;
  apiUrl = 'http://localhost:4200/assets/data.json';

  constructor(private http: HttpClient) { }

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(catchError(handleError));;
  }

  getProductById(id: number): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(catchError(handleError));
  }

  addProduct(product: ProductQuantity): void {
    let currentCart = JSON.parse(this.localStorage.getItem('udacity-my-store-products') || '[]');
    const productIndex = currentCart.findIndex((item: ProductQuantity) => item.productItem.id === product.productItem.id);
    if (productIndex !== -1) {
      currentCart[productIndex].quantity = currentCart[productIndex].quantity + 1;
    } else {
      currentCart = [...currentCart, product];
    }
    this.localStorage.setItem('udacity-my-store-products', JSON.stringify(currentCart));
  }
}
