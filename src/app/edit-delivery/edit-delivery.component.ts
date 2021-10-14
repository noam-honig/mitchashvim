import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataAreaFieldsSetting, DataAreaSettings } from '@remult/angular';
import { Delivery } from '../deliveries/delivery';
import { terms } from '../terms';
import { assign } from 'remult/assign';

@Component({
  selector: 'app-edit-delivery',
  templateUrl: './edit-delivery.component.html',
  styleUrls: ['./edit-delivery.component.scss']
})
export class EditDeliveryComponent implements OnInit {

  constructor(private ref: MatDialogRef<any>) { }
  args!: {
    delivery: Delivery,
    ok?: () => void,
    strategy: editStrategy
  }


  deliveryInfo!: DataAreaSettings;
  pickupInfo!: DataAreaSettings;
  dropOfInfo!: DataAreaSettings;
  finalInfo!: DataAreaSettings
  terms = terms;
  ngOnInit(): void {
    let d = this.args.delivery;
    let deliveryInfo = {
      readonly: !this.args.strategy.allowEditDeliveryRequest
    } as DataAreaFieldsSetting<any>;

    this.deliveryInfo = new DataAreaSettings({

      fields: () => [
        [
          { field: d.$.number, readonly: true, visible: () => !d.isNew() },
          { ...deliveryInfo, field: d.$.type },
          { ...deliveryInfo, field: d.$.source },
          { ...deliveryInfo, field: d.$.target }
        ],
        [
          { ...deliveryInfo, field: d.$.surfaces },
          { ...deliveryInfo, field: d.$.laptops },
          { ...deliveryInfo, field: d.$.screens },
          { ...deliveryInfo, field: d.$.computers },
          { ...deliveryInfo, field: d.$.other }
        ],
        { ...deliveryInfo, field: d.$.notes }
      ]
    });
    let scheduleSettings: DataAreaFieldsSetting<any> = {
      visible: () => !d.isNew(),
      readonly: !this.args.strategy.allowEditSchedule
    }

    this.pickupInfo = new DataAreaSettings({
      fields: () => [

        [{ ...scheduleSettings, field: d.$.pickupDate! }
          , { ...scheduleSettings, field: d.$.pickupTime }
          ,
        !this.args.strategy.allowEditSchedule ? {
          visible:()=>!d.isNew(),
          caption: d.$.pickupTimeConfirmed.metadata.caption,
          getValue: () => d.pickupTimeConfirmed ? 'כן' :
            'לא'
        }
          :
          {
            ...scheduleSettings, field: d.$.pickupTimeConfirmed
          }
        ],
        [
          d.$.pickupContactPerson,
          d.$.pickupPhone,
          d.$.pickupCity
        ],
        d.$.pickupTimeComment
      ]
    });
    this.dropOfInfo = new DataAreaSettings({
      fields: () => [
        [
          { ...scheduleSettings, field: d.$.deliveryDate! },
          { ...scheduleSettings, field: d.$.deliveryTime },
          !this.args.strategy.allowEditSchedule ? {
            visible:()=>!d.isNew(),
            caption: d.$.deliveryTimeConfirmed.metadata.caption,
            getValue: () => d.deliveryTimeConfirmed ? 'כן' :
              'לא'
          }
            :
            { ...scheduleSettings, field: d.$.deliveryTimeConfirmed }
        ], [
          d.$.deliveryContactPerson,
          d.$.deliveryPhone,
          d.$.deliveryCity
        ],

        d.$.deliveryTimeComment,

      ]
    });
    this.finalInfo = new DataAreaSettings({
      fields: () => [
        [d.$.status, d.$.notesForMitchashvim, d.$.actualSurfaces]
      ]
    })

  }
  async confirm() {
    let d = this.args.delivery;
    
    await this.args.delivery.save();
    if (this.args.ok)
      this.args.ok();
    this.ref.close();
  }
  async cancel() {
    this.args.delivery._.undoChanges();
    this.ref.close();
  }

}

export class editStrategy {
  static mitchashvim: editStrategy = assign(new editStrategy(), {
    allowEditDeliveryRequest: true
  });
  static deliveryManager: editStrategy = assign(new editStrategy(), {
    allowEditSchedule: true
  })

  allowEditSchedule = false;
  allowEditDeliveryRequest = false;


}