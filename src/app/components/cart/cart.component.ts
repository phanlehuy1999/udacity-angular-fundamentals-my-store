import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CartService} from "../../services/cart/cart.service";
import {ProductQuantity} from "../../models/product.model";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {DialogConfirmComponent} from "../dialog-confirm/dialog-confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {filter} from "rxjs";
import {Router} from "@angular/router";

interface ConfirmForm {
  fullName: FormControl<string | null>;
  address: FormControl<string | null>;
  creditNumber: FormControl<string | null>;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('productSelectionList') productSelectionList!: MatSelectionList;
  productCartList: ProductQuantity[] = [];
  total: number = 0;

  confirmFormGroup = new FormGroup<ConfirmForm>({
    fullName: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    address: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    creditNumber: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
      this.isNumber()
    ])
  });

  isNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const onlyNumber = /^[0-9]*$/;
      return !onlyNumber.test(control.value) ? { isNotNumber: true } : null;
    }
  }

  get fullNameControl() {
    return this.confirmFormGroup.get('fullName') as FormControl<string | null>;
  }

  get addressControl() {
    return this.confirmFormGroup.get('address')  as FormControl<string | null>;
  }

  get creditNumberControl() {
    return this.confirmFormGroup.get('creditNumber')  as FormControl<string | null>;
  }

  constructor(private cartService: CartService, private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.productCartList = this.cartService.getCartProducts();
  }

  onSelectionChange(listOption: MatListOption[]) {
    const result = listOption.reduce((pre, cur) => {
      return pre += cur.value.productItem.price * cur.value.quantity;
    }, 0);
    this.total = Math.round(result * 100) / 100;
    this.cartService.saveCurrentCart(this.productCartList);
  }

  onQuantityChanged() {
    this.onSelectionChange(this.productSelectionList.selectedOptions.selected);
  }

  openDialogConfirmBack() {
    const dialog = this.dialog.open(DialogConfirmComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        dialogType: 'confirm',
        message: 'Confirm back to product list?'
      }
    });
    dialog.afterClosed().pipe(filter(submit => !!submit)).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  onDeleteProduct(productId: number) {
    const dialog = this.dialog.open(DialogConfirmComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        dialogType: 'confirm',
        message: 'Confirm removal of this product from the cart?'
      }
    });
    dialog.afterClosed().pipe(filter(submit => !!submit)).subscribe(() => {
      this.productCartList = this.productCartList.filter(product => product.productItem.id !== productId);
      this.cartService.saveCurrentCart(this.productCartList);
    });
  }

  deleteMultiProducts() {
    const dialog = this.dialog.open(DialogConfirmComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        dialogType: 'confirm',
        message: 'Confirm removal of these products from the cart?'
      }
    });
    dialog.afterClosed().pipe(filter(submit => !!submit)).subscribe(() => {
      this.productCartList = this.productCartList.filter(
        product => !this.productSelectionList.selectedOptions.selected.some(
          selected => selected.value.productItem.id === product.productItem.id
        )
      );
      this.cartService.saveCurrentCart(this.productCartList);
    });
  }

  confirmOrder() {
    const dialog = this.dialog.open(DialogConfirmComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        dialogType: 'confirm',
        message: 'Confirm order?'
      }
    });
    dialog.afterClosed().pipe(filter(submit => !!submit)).subscribe(() => {
      this.router.navigate(['/confirm'], {
        state: {
          total: this.total,
          fullName: this.fullNameControl.value,
          address: this.addressControl.value
        }
      })
    });
  }

  ngOnDestroy() {
    this.cartService.saveCurrentCart(this.productCartList);
  }
}
