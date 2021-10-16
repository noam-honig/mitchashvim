import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BusyService, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { EditSiteComponent } from '../edit-site/edit-site.component';
import { Site } from '../sites/site';
import { SiteType } from '../sites/site-type';

@Component({
  selector: 'app-select-site',
  templateUrl: './select-site.component.html',
  styleUrls: ['./select-site.component.scss']
})
export class SelectSiteComponent implements OnInit {

  constructor(private remult: Remult, private busy: BusyService, private dialogRef: MatDialogRef<any>) { }
  sites: Site[] = [];
  ngOnInit() {
    this.filterSite = this.args.siteType;
    this.loadSites();
  }
  async loadSites() {
    this.sites = await this.remult.repo(Site).find({
      where: p =>
        // if there is a search value, search by it
        p.type.isEqualTo(this.filterSite)
          .and(p.deleted.isEqualTo(false)).and(
            this.searchString ? p.name.contains(this.searchString)
              : undefined!)
    });
  }
  async doSearch() {
    await this.busy.donotWait(async () => this.loadSites());
  }

  searchString = '';

  filterSite = SiteType.donor;
  options = [
    SiteType.donor, SiteType.lab, SiteType.rashut
  ]
  args!: {
    title?: string,
    siteType: SiteType,
    onSelect: (p: Site) => void;
  }
  select(p: Site) {
    this.args.onSelect(p);
    this.dialogRef.close();
  }
  selectFirst() {
    if (this.sites.length > 0)
      this.select(this.sites[0]);
  }
  create() {
    let site = this.remult.repo(Site).create({
      name: this.searchString,
      type: this.filterSite
    });
    openDialog(EditSiteComponent, x => x.args = {
      site,
      ok: () => {
        this.select(site);
      }
    });
  }

}
