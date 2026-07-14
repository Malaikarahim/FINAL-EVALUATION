import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private countSubject = new BehaviorSubject<number>(0);
  isLoading$ = this.countSubject.asObservable();

  show(): void {
    this.countSubject.next(this.countSubject.value + 1);
  }

  hide(): void {
    this.countSubject.next(Math.max(0, this.countSubject.value - 1));
  }
}
