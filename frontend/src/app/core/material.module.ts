import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatTableModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatListModule
} from '@angular/material';

const ngModules: Array<any> = [
  CommonModule,
  MatToolbarModule, 
  MatButtonModule, 
  MatCardModule, 
  MatInputModule, 
  MatDialogModule, 
  MatTableModule, 
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatListModule
];

@NgModule({
  imports: ngModules,
  exports: ngModules
})

export class CustomMaterialModule { }