import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ApiService} from "../core/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService) {}
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]});
    }
    get form() { return this.loginForm.controls; }
    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) return;
        
        this.loading = true;
        this.apiService.login({email: this.form.email.value, password: this.form.password.value})
            .subscribe(
                data => {
                    localStorage.setItem("token", data.result.token);
                    this.loading = false;
                    this.router.navigate(['dashboard']);
                },
                error => {
                    this.loading = false;
                });
    }

}