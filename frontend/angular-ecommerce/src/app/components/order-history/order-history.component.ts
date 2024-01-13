import {Component, OnInit} from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {Observable} from "rxjs";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {
  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory() {
    //TODO: Retrieve email from session
    console.log('inside OrderHistoryComponent');
    // let email = JSON.parse(this.storage.getItem('userEmail')!);
    this.orderHistoryService.getOrderHistory("mohamedfwy@gmail.com").subscribe(
      data => {
        print()
        let ListorderHistory1 = data._embedded.orders;
        console.log(`length = ${ListorderHistory1.length}`)
        this.orderHistory = ListorderHistory1;
      }
    )

  }

}
