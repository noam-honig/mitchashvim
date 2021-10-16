import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataAreaFieldsSetting, DataAreaSettings, openDialog } from '@remult/angular';
import { Delivery } from '../deliveries/delivery';
import { terms } from '../terms';
import { assign } from 'remult/assign';
import { TrackChangesComponent } from '../track-changes/track-changes.component';
import { DeliveryStatus } from '../deliveries/delivery-status';

@Component({
  selector: 'app-edit-delivery',
  templateUrl: './edit-delivery.component.html',
  styleUrls: ['./edit-delivery.component.scss']
})
export class EditDeliveryComponent implements OnInit {

  constructor(private ref: MatDialogRef<any>) {
    ref.beforeClosed().subscribe(() => {
      if (this.args.delivery.wasChanged())
        this.args.delivery._.undoChanges();
    });
  }
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
        [
          d.$.pickupContactPerson,
          d.$.pickupPhone,
          d.$.pickupCity
        ],

        [{ ...scheduleSettings, field: d.$.pickupDate! }
          , { ...scheduleSettings, field: d.$.pickupTime }
          ,
        !this.args.strategy.allowEditSchedule ? {
          visible: () => !d.isNew(),
          caption: d.$.pickupTimeConfirmed.metadata.caption,
          getValue: () => d.pickupTimeConfirmed ? 'כן' :
            'לא'
        }
          :
          {
            ...scheduleSettings, field: d.$.pickupTimeConfirmed
          }
        ],

        d.$.pickupTimeComment
      ]
    });
    this.dropOfInfo = new DataAreaSettings({
      fields: () => [
        [
          d.$.deliveryContactPerson,
          d.$.deliveryPhone,
          d.$.deliveryCity
        ],
        [
          { ...scheduleSettings, field: d.$.deliveryDate! },
          { ...scheduleSettings, field: d.$.deliveryTime },
          !this.args.strategy.allowEditSchedule ? {
            visible: () => !d.isNew(),
            caption: d.$.deliveryTimeConfirmed.metadata.caption,
            getValue: () => d.deliveryTimeConfirmed ? 'כן' :
              'לא'
          }
            :
            { ...scheduleSettings, field: d.$.deliveryTimeConfirmed }
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
    if (d.wasChanged()) {
      if (!this.args.strategy.changeDoneByDeliveryManager) {
        let originalStatus = d.$.status.originalValue;
        if (d.isNew())
          originalStatus = DeliveryStatus.setup;

        if (originalStatus == DeliveryStatus.setup && d.status == DeliveryStatus.readyForDelivery) {
          d.changeSeenByDeliveryManager = true; //no need to highlight that a new shipment has arrived.
        }
        else if (originalStatus.highlightChangeToDeliveryManager)
          d.changeSeenByDeliveryManager = false;

      }
      await d.save();
    }
    if (this.args.ok)
      this.args.ok();
    this.ref.close();
  }
  async cancel() {
    this.args.delivery._.undoChanges();
    this.ref.close();
  }
  showChanges() {
    openDialog(TrackChangesComponent, x => x.args = {
      for: this.args.delivery
    })
  }

}

export class editStrategy {
  static mitchashvim: editStrategy = assign(new editStrategy(), {
    allowEditDeliveryRequest: true,

  });
  static deliveryManager: editStrategy = assign(new editStrategy(), {
    allowEditSchedule: true,
    changeDoneByDeliveryManager: true

  })

  allowEditSchedule = false;
  allowEditDeliveryRequest = false;
  changeDoneByDeliveryManager = false;


}