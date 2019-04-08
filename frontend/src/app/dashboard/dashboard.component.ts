import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../model/book.model';
import { BookService } from '../core/book.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  books: Array<Book>;
  constructor(
    private router: Router,
    private bookService: BookService
  ) {
    if (!localStorage.getItem('token') || localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) { 
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.bookService.getBooks()
      .subscribe(
        data => this.books = data.result,
        error => this.loading = false
      );
  }
  remove(slug: string) {
    this.loading = true;
    this.bookService.deleteBook(slug)
      .subscribe(
        data => this.ngOnInit(),
        error => this.loading = false
      );
  }

}
