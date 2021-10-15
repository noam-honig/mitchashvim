import { Component, OnInit } from '@angular/core';
import { EntityMetadata, IdEntity, Remult } from 'remult';
import { ChangeLog } from './change-log';

@Component({
  selector: 'app-track-changes',
  templateUrl: './track-changes.component.html',
  styleUrls: ['./track-changes.component.scss']
})
export class TrackChangesComponent implements OnInit {

  constructor(private remult: Remult) {

  }
  args!: {
    for: IdEntity
  }

  changes!: ChangeLog;
  meta!: EntityMetadata;
  async ngOnInit() {
    this.changes = await this.remult.repo(ChangeLog).findFirst(c => c.relatedId.isEqualTo(this.args.for.id));
    this.meta = this.args.for._.metadata;
  }

}
