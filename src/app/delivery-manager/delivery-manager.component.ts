import { Component, OnInit } from '@angular/core';
import { GridSettings, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { Delivery } from '../deliveries/delivery';
import { DeliveryStatus } from '../deliveries/delivery-status';
import { EditDeliveryComponent, editStrategy } from '../edit-delivery/edit-delivery.component';
import { columnOrderAndWidthSaver } from '../shared/columnOrderSaver';
import { deliveriesClick } from '../shared/multi-row-button';
import { TrackChangesComponent } from '../track-changes/track-changes.component';

@Component({
  selector: 'app-delivery-manager',
  templateUrl: './delivery-manager.component.html',
  styleUrls: ['./delivery-manager.component.scss']
})
export class DeliveryManagerComponent implements OnInit {


  constructor(private remult: Remult) { }

  deliveries: GridSettings<Delivery> = new GridSettings(this.remult.repo(Delivery), {
    //allowCrud: true,
    allowInsert: false,
    allowDelete: false,
    knowTotalRows: true,
    allowSelection: true,
    numOfColumnsInGrid: Delivery.colsInGrid,

    columnSettings: d => {
      return Delivery.deliveryColumns(d);
    },
    rowCssClass: d => d.rowCss(),
    where: d => Delivery.activeDeliveryFilter().or(d.changeSeenByDeliveryManager.isEqualTo(false)),
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
    },
    {
      name: 'הצג שינויים',
      click: d => openDialog(TrackChangesComponent, x => x.args = { for: d })
    },
    {
      name: 'סמן שראיתי את השינוי',
      click: d => {
        deliveriesClick(this.deliveries, this.remult, d, async d => {
          d.changeSeenByDeliveryManager = !d.changeSeenByDeliveryManager;
          d.save();
        })
      }
    },
    {
      name: 'סמן הודפס לנהג',
      click: d => deliveriesClick(this.deliveries, this.remult, d, async d => d.assign({ printedToDriver: !d.printedToDriver }).save())
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
