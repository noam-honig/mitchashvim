import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataAreaSettings } from '@remult/angular';
import { AddressInputComponent } from '../address-input/address-input.component';
import { GeocodeInformation } from '../shared/googleApiHelpers';
import { Site } from '../sites/site';
import { terms } from '../terms';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss']
})
export class EditSiteComponent implements OnInit {

  constructor(private ref: MatDialogRef<any>) { }
  args!: {
    site: Site,
    ok?: () => void
  }
  terms = terms;
  area!: DataAreaSettings;
  ngOnInit(): void {
    let s = this.args.site.$;
    this.area = new DataAreaSettings({
      fields: () => [
        [s.phone, s.contactPerson],
        s.commentForCourier,
        s.type
      ]
    });
  }

  async confirm() {
    await this.args.site.save();
    if (this.args.ok)
      this.args.ok();
    this.ref.close();
  }
  async cancel() {
    this.args.site._.undoChanges();
    this.ref.close();
  }


}
