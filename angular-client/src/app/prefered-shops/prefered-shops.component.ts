import { Component, OnInit } from '@angular/core';
import { ShopsService } from '../shops.service';

@Component({
  selector: 'app-prefered-shops',
  templateUrl: './prefered-shops.component.html',
  styleUrls: ['./prefered-shops.component.css']
})
export class PreferedShopsComponent implements OnInit {
  shops: any[] = [];
  constructor(private shopsService: ShopsService) { }

  ngOnInit() {
    this.shopsService.getPreferedShops().then(shops => {
      this.shops = shops;
      console.log(this.shops);
    });
  }
  removePreferedShop(shop: any) {
    this.shopsService.removePreferedShop(shop).catch(err => {
      console.log(err);
    });
  }

}
