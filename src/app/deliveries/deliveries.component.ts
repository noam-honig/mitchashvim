import { Component, OnInit } from '@angular/core';
import { GridSettings, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { Delivery } from './delivery';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  constructor(private remult: Remult) { }

  deliveries = new GridSettings(this.remult.repo(Delivery), {
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
      click: (d) => this.editDelivery(d)
    }]
  });

  private editDelivery(d: Delivery, ok?: () => {}) {
    openDialog(InputAreaComponent, x => x.args = {
      ok: async () => {
        if (ok)
          ok();
      },
      fields: () => [
        [d.$.type, d.$.source, d.$.target],
        [d.$.surfaces, d.$.laptops, d.$.screens, d.$.computers, d.$.other],
        d.$.notes
      ],
      title: 'משלוח חדש'
    });
  }

  ngOnInit(): void {

  }

}
