import { DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, effect, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton } from '@ionic/angular/common';
import { IonButton, IonButtons, IonCard, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonItemGroup, IonLabel, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, arrowBackOutline, arrowUndoOutline, arrowRedoOutline, checkmarkOutline, trashOutline, bookmark, bookmarkOutline, pin, pinOutline } from 'ionicons/icons';
import { Notes } from 'src/app/services/notes';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  standalone: true,
  imports: [IonCard, DatePipe, NgFor, SlicePipe, IonFab, IonFabButton, FormsModule, IonIcon, NgIf, IonInput, IonTextarea, IonToolbar, IonButton, IonButtons, IonHeader, IonTitle, IonItem, IonLabel],
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name?: string;
  @Input() folderId?:number|null
  @Output() headerEvent = new EventEmitter();
  note: any;
  variable: boolean = false
  notes: any[] = [];
  title = '';
  note1 = '';
  currentDate!: string;
  reUndo: boolean = true;
  undo: boolean = false;
  history: string[] = [];
  redoStack: string[] = [];
  notePad:any[]=[]
  editingNoteId!:number
  constructor(private notesService:Notes) {
    addIcons({ add, arrowBackOutline, arrowUndoOutline, arrowRedoOutline, checkmarkOutline, trashOutline });
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-GB', {
      weekday: undefined,
      day: '2-digit',
      month: 'long',
    }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.notesService.notes$.subscribe(notes => {
      this.notes = notes;
      if(this.notes.length>0){
      this.notePad = notes.filter(val => val.folderId === this.folderId);
    }else{this.notePad=[]}
    });
  }
  ngOnInit(): void {
    console.log('fgfgfg',this.folderId,this.name);
    const saved = localStorage.getItem('notes')
    if (this.name === 'Tab1page') {
      this.notePad =this.notes= saved ? JSON.parse(saved) : []
      console.log(';sd',this.notes)
      return
    }
    this.notes = saved ? JSON.parse(saved) : []
    this.notePad = this.notes.filter((val) => { return val.folderId === this.folderId })
  }
  onSave() {
    if (this.note1.length || this.title.length) {
      if(this.editingNoteId){
        const index=this.notes.findIndex(val=>val.id===this.editingNoteId);
        this.notes[index].title=this.title;
        this.notes[index].content=this.note1;
        this.notes[index].date=new Date();
        this.notes[index].folderId=this.folderId
      }
      else{
        this.notes.unshift({
          id: Date.now(),
          title: this.title,
          content: this.note1,
          date: new Date(),
          folderId: this.folderId
        });
    }
      localStorage.setItem('notes', JSON.stringify(this.notes));
      this.variable = false;
      this.note1 = '';
      this.title = '';
      this.headerEvent.emit(false);
      this.folderUpdate();
      this.notePad = this.notes.filter(val => val.folderId === this.folderId);
  }
  }

  folderUpdate(): void {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');

    const folderIndex = folders.findIndex((val: any) => val.folderId === this.folderId);
    if (folderIndex > -1) {
      folders[folderIndex].count = notes.filter((n: any) => n.folderId === this.folderId).length;
      localStorage.setItem('folders', JSON.stringify(folders));
    }
  }

  value(event: any) {
    this.reUndo = event.target.value.length > 0 ? false : true;
  }
  openNote(id: number) {
    const value = this.notes.find(val => id === val.id);
    this.variable = true;
    this.editingNoteId = id;
    this.headerEvent.emit(true);
    if (value) {
      this.note1 = value.content;
      this.title = value.title;
      this.history = [this.note1];
      this.redoStack = [];
      this.updateUndoRedoState();
    }
  }
  content(event: any) {
    const val = event.target.value;
    if (this.history[this.history.length - 1] !== val) {
      this.history.push(val);
      this.redoStack = []; // clear redo stack when typing
    }
    this.note1 = val;
    this.updateUndoRedoState();
  }
  onUndo() {
    if (this.history.length > 1) {
      const current = this.history.pop()!;
      this.redoStack.push(current);
      this.note1 = this.history[this.history.length - 1];
    }
    this.updateUndoRedoState();
  }
  onRedo() {
    if (this.redoStack.length > 0) {
      const next = this.redoStack.pop()!;
      this.history.push(next);
      this.note1 = next;
    }
    this.updateUndoRedoState();
  }
  onRedoDisable(): boolean {
    return this.redoStack.length === 0;
  }
  onBack() {
    this.variable = false;
    this.headerEvent.emit(this.variable);
    this.note1 = '';
    this.title = '';
    this.undo = false;
    this.redoStack = [];
    this.history = []
  }
  private updateUndoRedoState() {
    this.undo = this.history.length > 1;
    this.reUndo = this.redoStack.length === 0 && this.note1.length === 0;
  }
  togglePin(note: any) {
    note.pinned = !note.pinned;
    this.sortNotes();
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  toggleBookmark(note: any) {
    note.bookmarked = !note.bookmarked;
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
  ionViewWillEnter() {
    const saved = localStorage.getItem('notes')
    this.notes = saved ? JSON.parse(saved) : []
    if (this.notes.length === 0) { this.notePad = [] }
    else {
      this.notePad = this.notes.filter((val) => { return val.folderId === this.folderId })
    }
  }

  sortNotes() {
    this.notes.sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }
  // deleteNote(index: number, event: Event) {
  //   event.stopPropagation();
  //   this.notes.splice(index, 1);
  //   this.notePad = this.notes.filter((val) => { return val.folderId === this.folderId })
  //   localStorage.setItem('notes', JSON.stringify(this.notes));
  //   this.folderUpdate(-1);
  // }
  deleteNote(index: number, event: Event) {
    console.log('index',index);
    console.log('dfdf', this.notes)
    event.stopPropagation();
    this.notePad[index].removing = true;
    setTimeout(()=>{
      this.notes.splice(index, 1);
      console.log('this.note',this.notes);
      localStorage.setItem('notes', JSON.stringify(this.notes));
      this.notePad = this.notes.filter(val => val.folderId === this.folderId);
      this.folderUpdate();
      if (this.name === 'Tab1page') {
        this.notePad = JSON.parse(localStorage.getItem('notes') ?? '')
        this.notes = JSON.parse(localStorage.getItem('notes') ?? '')
      }
    },500)
  }
}
