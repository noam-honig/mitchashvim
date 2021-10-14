import { Component, OnInit } from '@angular/core';
import { GridSettings, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { EditSiteComponent } from '../edit-site/edit-site.component';
import { Site } from './site';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {

  constructor(private remult: Remult) { }

  sites = new GridSettings(this.remult.repo(Site), {
    allowCrud: true,
    allowDelete: false,
    allowInsert: false,
    rowButtons: [{
      icon: 'edit',
      textInMenu: () => 'עדכן',
      click: (site) => openDialog(EditSiteComponent, x => x.args = { site })
    }],
    gridButtons: [{
      textInMenu: () => 'הוסף',
      icon: 'add',
      click: async () => {
        let site = this.remult.repo(Site).create();
        await openDialog(EditSiteComponent, x => x.args = { site, ok: () => this.sites.items.push(site) });
      }
    }],
    newRow: site => {
      openDialog(EditSiteComponent, x => x.args = { site });
    }
  });

  ngOnInit(): void {
  }

}
