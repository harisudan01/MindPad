import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone:true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,NgIf],
})
export class Tab1Page implements OnInit {
  constructor() {}
  headerHide:boolean=false;
  showExplore:boolean=false;
  value(event:boolean){
    this.headerHide=event;
  }
  ngOnInit(): void {
    console.log('dfdgTab1')
  }
  ionViewWillEnter() {
    this.showExplore = false;
    setTimeout(() => this.showExplore = true),100; 
  }

}
