import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IState } from 'src/app/app.module';
import { IProduct } from 'src/models/product.model';
import { IUser } from 'src/models/user.model';
import { getBag } from '../../store/actions/bag.actions';

@Component({
  selector: 'app-shopping-page',
  templateUrl: './shopping-page.component.html',
  styleUrls: ['./shopping-page.component.css']
})
export class ShoppingPageComponent implements OnInit {

  constructor(private store: Store<IState>, private cookieService: CookieService) { }

  user: IUser;
  selectedProduct: IProduct;
  searchResults$: Observable<IProduct[]>;

  selectProduct(product) {
    this.selectedProduct = product;
  }

  search(productName) {
    this.searchResults$ =this.store.select(state => state.items.products.filter(p => p.name === productName))
  }

  ngOnInit(): void {
    this.store.dispatch(getBag({ userId: JSON.parse(this.cookieService.get('user'))._id }))
    this.store.select(state => state.user.user).subscribe({
      next: user => this.user = user,
    });
  }

}
