import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from '../app.module';
import { fetchProducts } from '../store/actions/products.actions'
import { IProduct } from 'src/models/product.model';
import { Observable } from 'rxjs';
import { shopping } from '../store/actions/bag.actions';
import { IUser } from 'src/models/user.model';
import { categories } from '../consts';
import { ICategory } from 'src/models/category.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  
  constructor(private store: Store<IState>, private productService: ProductService) { }
  @Output() onSelect = new EventEmitter();
  products$: Observable<IProduct[]>;
  categories: ICategory[];
  user: IUser;
  products: IProduct[];
  productsByCategory: IProduct[];
  category:ICategory;
  bagId: string;
  ngOnInit(): void {
    this.productService.getCategories()
      .subscribe(categories => {
        this.categories = categories;
        this.category = categories[0];
        this.store.dispatch(fetchProducts());
    this.store.select(state => state.bag.bag?._id).subscribe({next: bagId => this.bagId=bagId});
    this.products$ = this.store.select(state => state.items.products);
    this.products$.subscribe(productsList => {
      if (productsList && productsList.length) {
        this.products=productsList;
        this.productsByCategory=this.products.filter(p => p.categoryId === this.category._id);
      }
    })
      })
    
    this.store.select(state => state.user.user)
    .subscribe({ next: user => this.user = user });
  }

  changeCategory(e) {
    this.productsByCategory=this.products.filter(p=>p.categoryId===e.target.value)
  }
  
  onProductClick(product) {
    this.onSelect.emit(product);
  }
  
  addToCart(productId,qty){
    if (!this.bagId) {
      this.store.select(state => state.user.user._id).subscribe({next: userId => 
        this.store.dispatch(shopping({ product: productId, qty, bagId: this.bagId, userId }))
      })
    } 
    else {
      this.store.dispatch(shopping({ product: productId, qty, bagId: this.bagId, userId:undefined }))
    }
  }
}


