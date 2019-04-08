import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategorieService } from '../core/categorie.service';
import { Categorie } from '../model/Categorie.model';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit {
  categorieForm: FormGroup;
  categorie: Categorie;
  categories: Array<Categorie>;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private categorieService: CategorieService
  ) { }
  ngOnInit() {
    this.categorieForm = this.formBuilder.group({
      name: ['', Validators.required]});
      this.categorieService.getCategories()
      .subscribe(
        data => this.categories = data.result
      );
  }
  get form() { return this.categorieForm.controls; }
  onSubmit() {
      this.submitted = true;

      if (this.categorieForm.invalid) return;
      
      this.loading = true;
      this.categorieService.createCategorie({name: this.form.name.value, slug: null})
          .subscribe(
              data => {
                  this.ngOnInit()
                  this.loading = false;
              },
              error => {
                  this.loading = false;
              });
  }
}
