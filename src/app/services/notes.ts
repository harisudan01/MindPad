import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notes {
  private notesSubject = new BehaviorSubject<any[]>([]);
  notes$ = this.notesSubject.asObservable();

  refresh() {
    const saved = localStorage.getItem('notes');
    this.notesSubject.next(saved ? JSON.parse(saved) : []);
  } 
}