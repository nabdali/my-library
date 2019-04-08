import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Book} from "../model/book.model";
import {Observable} from "rxjs/index";
import {ApiResponse} from "../model/api.response";

@Injectable()
export class BookService {

  constructor(private http: HttpClient) { }
  baseUrl: string = 'http://localhost:3000/api/books';

  getBooks() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getBookBySlug(slug: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${slug}`);
  }

  createBook(book: Book): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, {book});
  }

  updateBook(book: Book): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${book.slug}`, {book});
  }

  deleteBook(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }
}