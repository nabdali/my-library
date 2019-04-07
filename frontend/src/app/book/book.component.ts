import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../core/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  bookForm: FormGroup;
  book: Book = new Book();
  submitted = false;
  loading = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private bookService: BookService
  ) {
    if (!localStorage.getItem('token') || localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) { 
      this.router.navigate(['/']);
    }
  }
  ngOnInit() {
    this.bookForm = 
      this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required]});
  }
  get form() { return this.bookForm.controls; }
  onSubmit() {
    this.submitted = true;

    if (this.bookForm.invalid) return;
    
    this.loading = true;
    this.book.title = this.form.title.value;
    this.book.description = this.form.description.value;

    this.bookService.createBook(this.book)
        .subscribe(
            data => {
                this.loading = false;
                this.router.navigate(['dashboard']);
            },
            error => {
                this.loading = false;
            });
  }
}
