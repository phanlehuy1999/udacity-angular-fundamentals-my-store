import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../services/product/product.service";
import {Product} from "../../models/product.model";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject();
  productList: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}
  ngOnInit() {
    this.productService.getProduct().pipe(takeUntil(this.componentDestroyed$)).subscribe(
      {
        next: (res) => {
          this.productList = res;
        },
        error: (err) => console.log(err),
      }
    );
  }

  navigateToProductDetail(productId: number) {
    this.router.navigate([`/product/${productId}`]);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
