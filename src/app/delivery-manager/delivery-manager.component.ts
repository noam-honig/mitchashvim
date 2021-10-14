import { Component, OnInit } from '@angular/core';
import { GridSettings, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { Delivery } from '../deliveries/delivery';
import { DeliveryStatus } from '../deliveries/delivery-status';
import { EditDeliveryComponent, editStrategy } from '../edit-delivery/edit-delivery.component';
import { columnOrderAndWidthSaver } from '../shared/columnOrderSaver';

@Component({
  selector: 'app-delivery-manager',
  templateUrl: './delivery-manager.component.html',
  styleUrls: ['./delivery-manager.component.scss']
})
export class DeliveryManagerComponent implements OnInit {


  constructor(private remult: Remult) { }

  deliveries = new GridSettings(this.remult.repo(Delivery), {
    //allowCrud: true,
    allowInsert: false,
    allowDelete: false,
    knowTotalRows: true,
    numOfColumnsInGrid: Delivery.colsInGrid,

    columnSettings: d => {
      return Delivery.deliveryColumns(d);
    },
    where: d => Delivery.activeDeliveryFilter().or(d.status.isEqualTo(DeliveryStatus.canceled)),//.and(d.wasChangedByMitchashvim.isEqualTo(true))),
    rowButtons: [{
      icon: 'edit',
      textInMenu: () => 'עדכן משלוח',
      click: (d) => this.editDelivery(d),

    },
    {
      icon: 'done',
      name: 'סמן כהושלם',
      click: d => {
        openDialog(InputAreaComponent, x => x.args = {
          title: 'סמן כהושלם',
          fields: () => [d.$.actualSurfaces,
          d.$.notesForMitchashvim],
          ok: () => {
            d.status = DeliveryStatus.completed;
            d.save();
          }
        })
      }
    },
    {
      icon: 'error',
      name: 'דווח בעיה',
      click: d => {
        openDialog(InputAreaComponent, x => x.args = {
          title: 'דווח בעיה',
          fields: () => [
            d.$.notesForMitchashvim],
          ok: () => {
            d.status = DeliveryStatus.problem;
            d.save();
          }
        })
      }
    }
    ]
  });

  private editDelivery(delivery: Delivery, ok?: () => void) {
    openDialog(EditDeliveryComponent, x => x.args = {
      delivery,
      strategy: editStrategy.deliveryManager,
      ok: () => {
        if (ok)
          ok();
      }
    });

  }

  ngOnInit(): void {
    new columnOrderAndWidthSaver(this.deliveries).load("delivery-manager");

  }

}
