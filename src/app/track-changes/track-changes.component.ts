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
  showDate(d: Date) {
    if (typeof (d) === "string")
      d = new Date(d);
    return d?.toLocaleDateString('he-il');
  }

  changes!: ChangeLog;
  meta!: EntityMetadata;
  async ngOnInit() {
    this.changes = await this.remult.repo(ChangeLog).findFirst(c => c.relatedId.isEqualTo(this.args.for.id));
    this.meta = this.args.for._.metadata;
  }

}
