import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ApiService} from "../core/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService) {}
    ngOnInit() {
        this.registerForm = 
            this.formBuilder.group({
                username: ['', Validators.required],
                email: ['', Validators.required],
                password: ['', Validators.required]});
    }
    get form() { return this.registerForm.controls; }
    onSubmit() {
        this.submitted = true;

        if (this.registerForm.invalid) return;
        
        this.loading = true;
        this.apiService.createUser({_id: null, username: this.form.username.value, email: this.form.email.value, password: this.form.password.value, token:null})
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
