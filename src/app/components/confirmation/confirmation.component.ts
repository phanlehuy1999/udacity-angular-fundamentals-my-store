import {Component} from '@angular/core';
import {Router} from "@angular/router";

interface Data {
  total: number;
  fullName: string;
  address: string;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
  data: Data;
  constructor(private router: Router) {
    this.data = this.router.getCurrentNavigation()?.extras.state as Data;
  }
}
