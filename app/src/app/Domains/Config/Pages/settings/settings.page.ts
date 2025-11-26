import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from '@src/app/Core/Services/theme/theme.service';
import { UserService } from '@src/app/Core/Services/user/user.service';

@Component({
  selector: 'page-settings',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss'
})
export class SettingsPage implements OnInit {
  settingsForm: FormGroup;
  profileForm: FormGroup;
  currentTheme: 'light' | 'dark' = 'dark';
  avatarPreview: string = '';

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private userService: UserService
  ) {
    this.settingsForm = this.fb.group({
      githubToken: [''],
      githubUsername: [''],
      gitEmail: [''],
      gitName: ['']
    });

    this.profileForm = this.fb.group({
      userName: ['']
    });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.theme;
    this.loadSettings();
    this.loadProfile();
  }

  loadSettings() {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.settingsForm.patchValue(settings);
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
  }

  loadProfile() {
    const profile = this.userService.currentProfile;
    this.profileForm.patchValue({ userName: profile.name });
    this.avatarPreview = profile.avatar;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveSettings() {
    // Save general settings
    const settings = this.settingsForm.value;
    localStorage.setItem('userSettings', JSON.stringify(settings));

    // Save profile settings
    const profileData = {
      name: this.profileForm.get('userName')?.value,
      avatar: this.avatarPreview
    };
    this.userService.updateProfile(profileData);

    alert('Configurações salvas com sucesso!');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.theme;
  }
}

