import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  name: string;
  avatar: string; // Base64 or URL
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'userProfile';
  
  private userProfileSubject = new BehaviorSubject<UserProfile>(this.loadProfile());
  userProfile$ = this.userProfileSubject.asObservable();

  constructor() { }

  private loadProfile(): UserProfile {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading user profile', e);
      }
    }
    
    // Default profile
    return {
      name: 'Kássio Douglas',
      avatar: 'https://i.pravatar.cc/300'
    };
  }

  updateProfile(profile: Partial<UserProfile>) {
    const current = this.userProfileSubject.value;
    const updated = { ...current, ...profile };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.userProfileSubject.next(updated);
  }

  get currentProfile(): UserProfile {
    return this.userProfileSubject.value;
  }
}
