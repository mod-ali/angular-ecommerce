import {ProductService} from './services/product.service';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {Routes, RouterModule} from '@angular/router';
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component'
import {SearchComponent} from './components/search/search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './components/login/login.component';
import {MembersPageComponent} from './components/members-page/members-page.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {LoginStatusComponent} from "./components/login-status/login-status.component";
import {AuthInterceptorService} from "./services/auth-interceptor.service";


function sendToLoginPage() {
  //TODO: route to login page
}

const routes: Routes = [
  {
    path: 'orders-history', component: OrderHistoryComponent,
    canActivate: [],
    data: {onAuthRequired: sendToLoginPage}
  },
  {
    path: 'members', component: MembersPageComponent,
    canActivate: [],
    data: {onAuthRequired: sendToLoginPage}
  }, // angular route guard
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category/', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SearchComponent,
    ProductCategoryMenuComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [ProductService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})

export class AppModule {
}
