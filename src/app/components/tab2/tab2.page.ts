import { Component, effect, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, AlertController, IonItem, IonList, IonLabel, IonBadge, IonButton, IonButtons } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, bagAddOutline, trashOutline } from 'ionicons/icons';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone:true,
  imports: [IonHeader, IonToolbar, NgFor, IonItem, IonList, IonLabel, IonBadge, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonButton, IonButtons, NgIf, NgTemplateOutlet, ExploreContainerComponent]
})
export class Tab2Page implements OnInit,OnDestroy {

  @ViewChild('explore', { static: false }) explore!: TemplateRef<null>;
  constructor(private alertCtrl: AlertController,private vcr:ViewContainerRef) {
    effect(()=>{
      console.log('dff')
    })
    addIcons({ bagAddOutline, trashOutline, arrowBackOutline })
  }
  folders: { name?: string; count?: number|null;folderId?:number|null }[] = [
    { name: 'Not grouped', count: null,folderId:1 }
  ];
  folderHide:boolean=false;
  clickedFolderName:string=''
  hideFolderHead:boolean=false;
  folderId!:number|null
  ngOnInit(): void {
    const saved = localStorage.getItem('folders');
    let val: { name?: string; count?: number }[] = [];
    try {
      val = saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Invalid folders JSON in localStorage, resetting.', e);
      val = [];
    }

    if (val.length > 0) {
      this.folders = val;
      console.log('folders',this.folders);
    } else {
      const saved11 = localStorage.getItem('notes');
      const valuecount = saved11
        ? JSON.parse(saved11).filter((k: any) => k.folderId === 1).length
        : 0;
      this.folders[0].count=valuecount
      localStorage.setItem('folders', JSON.stringify(this.folders));
    }
  }
  ionViewWillEnter() {
    this.folderHide=false
    const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]');
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    savedFolders.forEach((folder: any) => {
      folder.count = savedNotes.filter((n: any) => n.folderId === folder.folderId).length;
    });

    this.folders = savedFolders;
    localStorage.setItem('folders', JSON.stringify(this.folders));
  }

  async openAddFolderDialog() {
    const alert = await this.alertCtrl.create({
      header: 'New folder',
      inputs: [
        {
          name: 'folderName',
          type: 'text',
          placeholder: 'New folder',
          value: 'New folder'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: data => {
            if (data.folderName.trim()) {
              this.folders.push({ name: data.folderName.trim(), count: 0,folderId:Date.now() });
              localStorage.setItem('folders',JSON.stringify(this.folders))
            }
          }
        }
      ]
    });

    await alert.present();
  }
  deleteFolder(id:number){
    this.folders.splice(id,1);
    localStorage.setItem('folders',JSON.stringify(this.folders))
  }
  folderopen(id:number):void{
    console.log('djfdf',id)
    this.folderHide=true;
    this.clickedFolderName=this.folders[id].name??''
    this.folderId = this.folders[id].folderId??null;
  }
  onBack(){
    this.folderHide=false;
    const folderVal=localStorage.getItem('folders');
    this.folders=folderVal?JSON.parse(folderVal):[]
  }
  value(event:any){
    console.log('evetn',event);
    this.hideFolderHead=event
  }
  ngOnDestroy(){
    this.folderHide=false;
    this.folderHide = false;
    this.clickedFolderName = ''
    this.hideFolderHead = false;
    this.folderId = null
  }
}
