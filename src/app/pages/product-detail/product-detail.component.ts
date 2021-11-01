import { Component, OnInit } from '@angular/core';
// location nos permite la navegacion en ruta
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Product } from '../../models/product.model';
import { ProductsService } from './../../services/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          // obtenemos el id del request para recuperar la informacion de product
          this.productId = params.get('id');
          if (this.productId) {
            return this.productsService.getOne(this.productId);
          }
          // si no encuentra el producto, retornamos un null
          return [null];
        })
      )
      .subscribe((data) => {
        this.product = data;
      });
  }

  goToBack() {
    this.location.back();
  }
}
