import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product/product.service";
import {Subject, takeUntil} from "rxjs";
import {Product, ProductQuantity} from "../../models/product.model";
import {DialogConfirmComponent} from "../dialog-confirm/dialog-confirm.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.scss']
})
export class ProductItemDetailComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject();
  productId!: number;
  productItem!: Product | undefined;
  quantities: number[] = [1, 2, 3, 4, 5];
  selectedQuantity: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this.productId = activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.productService.getProduct().pipe(takeUntil(this.componentDestroyed$)).subscribe(
      {
        next: (res) => {
          this.productItem = res.find(item => item.id === Number(this.productId));
        },
        error: (err) => console.log(err),
      }
    );
  }

  onChangeQuantity($event: any) {
    this.selectedQuantity = $event;
  }


  addToCart() {
    this.productService.addProduct({
      productItem: this.productItem,
      quantity: this.selectedQuantity
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

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
