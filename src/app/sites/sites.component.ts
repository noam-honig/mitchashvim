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
  showDeleted = false;

  sites = new GridSettings(this.remult.repo(Site), {
    rowCssClass: s => s.deleted ? 'deleted' : '',
    where: s => this.showDeleted ? undefined! : s.deleted.isEqualTo(false),
    columnSettings: s => [...s].filter(c => c != s.id && c != s.addressApiResult),

    rowButtons: [{
      icon: 'edit',
      textInMenu: () => 'עדכן',
      click: (site) => openDialog(EditSiteComponent, x => x.args = { site })
    }, {
      icon: 'delete',
      name: 'מחק',
      click: site => site.assign({ deleted: !site.deleted }).save()
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
