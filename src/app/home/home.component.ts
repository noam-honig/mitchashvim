import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Field, getFields, Remult } from 'remult';
import { AddressInputComponent } from '../address-input/address-input.component';
import { GeocodeInformation } from '../shared/googleApiHelpers';
import { Site } from '../sites/site';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private remult: Remult) { }


  @ViewChild('addressInput', { static: false }) addressInput!: AddressInputComponent;


  result: any = {};
  site = this.remult.repo(Site).create();

  ngOnInit() {

  }

}

