import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { Delivery } from '../deliveries/delivery';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  constructor(private remult: Remult) { }
  deliveries = this.remult.repo(Delivery).find({
    limit: 1000,
    where: d => Delivery.activeDeliveryFilter(),
    orderBy: d => [d.pickupCity, d.pickupDate!, d.deliveryCity, d.deliveryDate!, d.number]
  })
  ngOnInit(): void {
  }

}
 