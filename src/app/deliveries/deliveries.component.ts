import { Component, OnInit } from '@angular/core';
import { DataControlInfo, DataControlSettings, GridSettings, openDialog } from '@remult/angular';
import { FieldMetadata, FieldsMetadata, Remult } from 'remult';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { YesNoQuestionComponent } from '../common/yes-no-question/yes-no-question.component';
import { EditDeliveryComponent, editStrategy } from '../edit-delivery/edit-delivery.component';
import { columnOrderAndWidthSaver } from '../shared/columnOrderSaver';
import { Delivery } from './delivery';
import { DeliveryStatus } from './delivery-status';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  constructor(private remult: Remult) { }

  deliveries = new GridSettings(this.remult.repo(Delivery), {
    //allowCrud: true,
    allowInsert: false,
    allowDelete: false,
    knowTotalRows: true,
    allowSelection: true,
    numOfColumnsInGrid: Delivery.colsInGrid,

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
    }],
    rowButtons: [{
      icon: 'edit',
      textInMenu: () => 'עדכן משלוח',
      click: (d) => this.editDelivery(d),
      showInLine: true
    },
    {
      name: 'סמן כמוכן למשלוח',
      click: async d => {
        if (this.deliveries.selectedRows.length > 0) {
          if (await this.remult.yesNoQuestion("לעדכן " + this.deliveries.selectedRows.length + " משלוחים?")) {
            for (const d of this.deliveries.selectedRows) {
              d.status = DeliveryStatus.readyForDelivery;
              await d.save();
            }
          }
        } else {
          d.status = DeliveryStatus.readyForDelivery;
          d.save();
        }
      }
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
