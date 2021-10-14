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
  deliveries: Delivery[] = [];
  async ngOnInit() {
    this.deliveries = await this.remult.repo(Delivery).find({
      limit: 1000,
      where: d => Delivery.activeDeliveryFilter(),
      orderBy: d => [d.pickupCity, d.pickupDate!, d.deliveryCity, d.deliveryDate!, d.number]
    })
  }
  contentText(d: Delivery) {
    let r = "";
    if (d.surfaces) {
      r = d.surfaces.toString();
    }
    else for (const f of [d.$.laptops, d.$.screens, d.$.computers, d.$.other]) {
      if (f.value) {
        if (r != '')
          r += ", ";
        r += f.value + " " + f.metadata.caption;
      }
    }
    if (d.notes)
      r += " - " + d.notes;
    return r;
  }

}
