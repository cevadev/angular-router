import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  myShoppingCart: Product[] = [];
  total = 0;
  @Input() products: Product[] = [];
  @Output() loadMore = new EventEmitter();
  showProductDetail = false;
  productChosen: Product | null = null;

  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  // Hacemos la primera peticion con pagnado
  /* ngOnInit(): void {
    this.productsService.getAll(10, 0).subscribe((data) => {
      this.products = data;
      this.offset += this.limit;
    });
  } */

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productsService.getOne(id).subscribe(
      (data) => {
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      (errorMsg) => {
        window.alert(errorMsg);
        this.statusDetail = 'error';
      }
    );
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo prodcuto',
      description: 'bla bla bla',
      images: [`https://placeimg.com/640/480/any?random=${Math.random()}`],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      this.products.unshift(data);
    });
  }

  updateProduct() {
    if (this.productChosen) {
      const changes: UpdateProductDTO = {
        title: 'change title',
      };
      const id = this.productChosen?.id;
      this.productsService.update(id, changes).subscribe((data) => {
        const productIndex = this.products.findIndex(
          (item) => item.id === this.productChosen?.id
        );
        this.products[productIndex] = data;
        this.productChosen = data;
      });
    }
  }

  deleteProduct() {
    if (this.productChosen) {
      const id = this.productChosen?.id;
      this.productsService.delete(id).subscribe(() => {
        const productIndex = this.products.findIndex(
          (item) => item.id === this.productChosen?.id
        );
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
    }
  }

  /* loadMore() {
    this.productsService.getAll(this.limit, this.offset).subscribe((data) => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  } */

  // cada vez que se hace click en el boton Load More emitimos un evento al padre que indica que se debe
  // cargar mas info
  onLoadMore() {
    this.loadMore.emit();
  }
}
