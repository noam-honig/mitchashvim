import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Field, getFields, Remult } from 'remult';
import { AddressInputComponent } from '../address-input/address-input.component';
import { Delivery } from '../deliveries/delivery';
import { GeocodeInformation } from '../shared/googleApiHelpers';
import { Site } from '../sites/site';
import { ChangeLog } from '../track-changes/change-log';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private remult: Remult) { }


  @ViewChild('addressInput', { static: false }) addressInput!: AddressInputComponent;


  result: any = {};
  site = this.remult.repo(Site).create({address:'שנהב 4 אבן יהודה'});


  changes!: ChangeLog;
  meta = this.remult.repo(Delivery).metadata;

  ngOnInit() {
    
    this.remult.repo(ChangeLog).findFirst().then(c => this.changes = c);

  }

}

