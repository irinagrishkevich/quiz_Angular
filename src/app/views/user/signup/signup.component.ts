import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SignupResponseType} from "../../../../types/signup-response.type";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    signupForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.pattern(/^[А-Я][а-я]+\s*$/)]),
        lastName: new FormControl('', [Validators.required, Validators.pattern(/^[А-Я][а-я]+\s*$/)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]),
        agree: new FormControl(false, [Validators.required])
    })

    constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

    ngOnInit(): void {
    }

    signup(){
        if (this.signupForm.valid &&
            this.signupForm.value.email && this.signupForm.value.password &&
            this.signupForm.value.name && this.signupForm.value.lastName) {
            this.authService.signup(this.signupForm.value.name, this.signupForm.value.lastName,
                this.signupForm.value.email, this.signupForm.value.password).subscribe({
                    next:(data: SignupResponseType) => {
                        console.log('Signup response:', data);
                        if(data.error || !data.user){
                            this._snackBar.open('Ошибка при регистрации')
                            throw new Error(data.message ? data.message : 'Invalid signup')
                        }
                        if(this.signupForm.value.email && this.signupForm.value.password){
                            this.authService.login(this.signupForm.value.email, this.signupForm.value.password)
                                .subscribe({
                                    next:(data: LoginResponseType) => {
                                        if (data.error || !data.accessToken || !data.refreshToken ||
                                            !data.fullName || !data.userId) {
                                            this._snackBar.open('Ошибка при авторизации')
                                            throw new Error(data.message ? data.message : 'Invalid login')
                                        }


                                        this.router.navigate(['/'])
                                    },
                                    error:(error: HttpErrorResponse) =>{
                                        this._snackBar.open('Ошибка при регистрации')
                                        throw new Error(error.error.message)
                                    }
                                })
                        }


                    },
                    error:(error: HttpErrorResponse) =>{
                        console.log('Signup response:', error);
                        this._snackBar.open('Ошибка при авторизации пользователя')
                        throw new Error(error.error.message)
                    }
                })

        }
    }

}