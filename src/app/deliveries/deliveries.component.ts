import { Component, OnInit } from '@angular/core';
import { DataControlInfo, DataControlSettings, GridSettings, openDialog, RowButton } from '@remult/angular';
import { FieldMetadata, FieldsMetadata, Remult } from 'remult';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { YesNoQuestionComponent } from '../common/yes-no-question/yes-no-question.component';
import { EditDeliveryComponent, editStrategy } from '../edit-delivery/edit-delivery.component';
import { columnOrderAndWidthSaver } from '../shared/columnOrderSaver';
import { deliveriesClick } from '../shared/multi-row-button';
import { Delivery } from './delivery';
import { DeliveryStatus } from './delivery-status';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  constructor(private remult: Remult) { }
  showArchive = false;
  deliveries: GridSettings<Delivery> = new GridSettings<Delivery>(this.remult.repo(Delivery), {
    //allowCrud: true,
    allowInsert: false,
    allowDelete: false,
    knowTotalRows: true,
    allowSelection: true,
    numOfColumnsInGrid: Delivery.colsInGrid,
    rowCssClass: d => d.rowCss(),
    where: d => !this.showArchive ? d.archive.isEqualTo(false) : undefined!,

    columnSettings: d => {
      return Delivery.deliveryColumns(d);
    },


    gridButtons: [{
      textInMenu: () => 'משלוח חדש',
      icon: 'add',
      click: () => {
        var d = this.remult.repo(Delivery).create();
        this.editDelivery(d, async () => {
          await d.save();
          this.deliveries.items.push(d);
        });
      }
    }, {
      name: 'הצג ארכיב',
      click: () => {
        this.showArchive = !this.showArchive;
        this.deliveries.reloadData()
      }
    }
    ],
    rowButtons: [{
      icon: 'edit',
      textInMenu: () => 'עדכן משלוח',
      click: (d) => this.editDelivery(d),
      showInLine: true
    },
    {
      name: 'סמן כמוכן למשלוח',
      click: d => deliveriesClick(this.deliveries, this.remult, d,
        async d => {
          d.status = DeliveryStatus.readyForDelivery;
          if (d.$.status.originalValue == DeliveryStatus.setup)
            d.changeSeenByDeliveryManager = true;
          await d.save();
        })
    },
    {
      name: 'העבר לארכיב',
      click: d => deliveriesClick(this.deliveries, this.remult, d,
        async d => {
          d.archive = !d.archive;
          await d.save();
        })
    }
    ]
  });



  private editDelivery(delivery: Delivery, ok?: () => void) {
    openDialog(EditDeliveryComponent, x => x.args = {
      delivery,
      strategy: editStrategy.mitchashvim,
      ok: () => {
        if (ok)
          ok();
      }
    });

  }

  ngOnInit(): void {
    new columnOrderAndWidthSaver(this.deliveries).load("deliveries");

  }

}
