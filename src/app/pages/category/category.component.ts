import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Product } from '../../models/product.model';
import { ProductsService } from './../../services/products.service';

@Component({
  selector: 'app-category',
  template: `<app-products
    [products]="products"
    (loadMore)="onLoadMore()"
  ></app-products>`,
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryId: string | null = null;
  // controlamos la paginacion
  limit = 10;
  offset = 0;
  products: Product[] = [];

  constructor(
    // aplicamos inyecciones
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    // nos suscribimos a paramMap
    this.route.paramMap
      .pipe(
        // con switchMap evitamos el callback hell y concatenar las suscripciones
        switchMap((params) => {
          // obtenemos el categoryId del request
          // switchMap espera que siempre le retornemos un observable
          this.categoryId = params.get('id');
          // validamos que categoryId no sea null
          if (this.categoryId) {
            // ya no hacemos el suscribe sino retornamos los datos de manera directa
            // retornamos el observador que es el qe haría la peticion en el caso que hay un id
            return this.productsService.getByCategory(
              this.categoryId,
              this.limit,
              this.offset
            );
          }
          // si no se envia id en la peticion retornamos un array vacio
          return [];
        })
      )
      // podemos concatenar mas subsribe
      // nos suscribimos y recibimos la info
      .subscribe((data) => {
        // igualamos el array de products con la data que retorna
        this.products = data;
      });
  }

  onLoadMore() {
    if (this.categoryId) {
      this.productsService
        .getByCategory(this.categoryId, this.limit, this.offset)
        .subscribe((data) => {
          this.products = this.products.concat(data);
          this.offset += this.limit;
        });
    }
  }
}
