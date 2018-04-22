import { Component, OnInit } from '@angular/core';
import { ShopsService } from './shops.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  shops: any[] = [];

  constructor(private shopsService: ShopsService) { }

  ngOnInit() {
    this.shopsService.getShops().then(shops => this.shops = shops);
  }

}
