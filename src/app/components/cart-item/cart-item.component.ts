import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {ProductQuantity} from "../../models/product.model";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  @Input() product!: ProductQuantity;
  @Output() quantityChanged = new EventEmitter<boolean>;
  @Output() emitDeleteProduct = new EventEmitter<number>;

  changeQuantity($event: MouseEvent, type: string) {
    $event.preventDefault();
    $event.stopPropagation();
    if (type === 'remove') {
      this.product.quantity = Number(this.product.quantity) - 1;
    }
    if (type === 'add') {
      this.product.quantity = Number(this.product.quantity) + 1;
    }
    this.quantityChanged.emit(true);
  }

  inputQuantity($event: any) {
    this.product.quantity = $event;
    this.quantityChanged.emit(true);
  }

  deleteProduct($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.emitDeleteProduct.emit(this.product.productItem.id);
  }
}
