import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
// escuchamos la ruta
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  limit = 10;
  offset = 0;
  productId: string | null = null;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  // Hacemos la primera peticion con pagnado
  ngOnInit(): void {
    this.productsService.getAll(10, 0).subscribe((data) => {
      this.products = data;
      this.offset += this.limit;
    });
    //escuchamos los parametros url. Utilizamos queryParamMap ya que son param que no viene en la ruta sino
    // params tipo query
    this.route.queryParamMap.subscribe((params) => {
      this.productId = params.get('product');
      console.log(this.productId);
    });
  }

  // hace la carga de mas productos
  onLoadMore() {
    this.productsService.getAll(this.limit, this.offset).subscribe((data) => {
      // al array de producto le concatenamos la siguiente pagina
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
