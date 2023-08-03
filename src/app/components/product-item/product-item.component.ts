import {Component, Input} from '@angular/core';
import {Product, ProductQuantity} from "../../models/product.model";
import {ProductService} from "../../services/product/product.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmComponent} from "../dialog-confirm/dialog-confirm.component";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input() productItem!: Product;
  constructor(private productService: ProductService, private dialog: MatDialog) {}

  addToCart($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.productService.addProduct({
      productItem: this.productItem,
      quantity: 1
    } as ProductQuantity);
    this.openDialogNotification();
  }

  openDialogNotification() {
    this.dialog.open(DialogConfirmComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        dialogType: 'notification',
        message: 'The product has been added to cart!'
      }
    });
  }
}
