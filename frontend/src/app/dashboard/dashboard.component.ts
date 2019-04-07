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
      data => {
        console.log(data)
        this.books = data.result
        console.log(this.books)},
      error => this.loading = false
    );
  }

}
