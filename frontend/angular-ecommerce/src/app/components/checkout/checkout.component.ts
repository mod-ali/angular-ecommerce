import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {OnlineShopService} from "../../services/online-shop.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {WhiteSpaceValidator} from "../../validators/white-space-validator";
import {BehaviorSubject} from "rxjs";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  states: State[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private onlineShopService: OnlineShopService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  ngOnInit(): void {

    const email = JSON.parse(this.storage.getItem('userEmail')!);

    let EMAIL_REGEX = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        email: new FormControl(email, [Validators.required,
          Validators.pattern(EMAIL_REGEX), WhiteSpaceValidator.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.handleMonthsAndYears();

    // populate credit card years
    this.onlineShopService.getCreditYears().subscribe(
      data => {
        console.log("Retrieved Years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.onlineShopService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.reviewCartDetails();
  }

  reviewCartDetails(): void {
    this.cartService.totalQuantitySubject.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPriceSubject.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  private getCreditMonths(startMonth: number) {
    this.onlineShopService.getCreditMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  copyShippingAddressToBillingAddress(event: Event) {

    // @ts-ignore
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears() {
    const currentYear: number = this.checkoutFormGroup.get('creditCard').value.expirationYear;

    let startMonth = 1;
    if (currentYear == new Date().getFullYear()) {
      startMonth = new Date().getMonth() + 1;
      this.getCreditMonths(startMonth);
    } else {
      this.getCreditMonths(startMonth);
    }
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    this.onlineShopService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  onSubmit() {
    // console.log("Handling the submit button");
    // console.log("billing address " + this.checkoutFormGroup.get('billingAddress')?.value.city);
    // console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order: Order = new Order(this.totalQuantity, this.totalPrice);

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    let purchase: Purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: error => {
          alert(`There was an error:: ${error.message}`);
        }
      }
    )
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPriceSubject.next(0);
    this.cartService.totalQuantitySubject.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }
}
