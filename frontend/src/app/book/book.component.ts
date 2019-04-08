import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../core/book.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  update = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
  ) {
    if (!localStorage.getItem('token') || localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) { 
      this.router.navigate(['/']);
    }
  }
  //TODO: Improve function
  ngOnInit() {
    this.bookForm = 
        this.formBuilder.group({
          title: ['', Validators.required],
          description: ['', Validators.required],
          rate: ['']});
    const slug = this.route.snapshot.paramMap.get('slug');
    if(slug !== null && slug !== null) {
      this.update = true;
      this.loading = true;
      this.bookService.getBookBySlug(slug)
        .subscribe(
          data => {
            this.book = data.result
            this.bookForm.setValue({title: data.result.title, description: data.result.description, rate: data.result.rate})
            this.loading = false
          },
          error => this.loading = false
        )
    }
  }
  get form() { return this.bookForm.controls; }
  onSubmitCreate() {
    this.submitted = true;

    if (this.bookForm.invalid) return;
    
    this.loading = true;
    this.book.title = this.form.title.value;
    this.book.description = this.form.description.value;
    console.log(this.form.rate.value);
    this.book.rate = this.form.rate.value;

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
  onSubmitUpdate() {
    this.submitted = true;

    if (this.bookForm.invalid) return;
    
    this.loading = true;
    this.book.title = this.form.title.value;
    this.book.description = this.form.description.value;
    console.log(this.form.rate.value);
    this.book.rate = this.form.rate.value;

    this.bookService.updateBook({
      slug: this.book.slug,
      title: this.book.title,
      description: this.book.description,
      rate: this.book.rate
    })
        .subscribe(
            data => {
                this.loading = false;
                this.router.navigate(['dashboard']);
            },
            error => {
                this.loading = false;
            });
  }
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 10) {
      return Math.round(value / 10) + 'k';
    }

    return value;
  }
}
