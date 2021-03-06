import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.css']
})
  
export class AuthViewComponent implements OnInit {

  error_message: string;
  spinner = false;
  sign = "in";

  constructor(
    private authService: AuthService,
    private router: Router,
    private booksService: BooksService
  ) { }

  ngOnInit(): void {
  }

  onSignUpSubmit = (form: NgForm) => {
    const id = form.value["user_id"];
    const password = form.value["user_password"];
    this.spinner = true;

    this.authService.signUp(id, password)
      .then(response => {
        if (response === "exists") {
          this.error_message = "Identifiant déjà utilisé.";
          this.spinner = false;
        } else {
          this.spinner = false;
          this.router.navigate(["/"]);
        }
      })
      .catch(error => console.error("Error: ", error));
  }

  onSignInSubmit = (form: NgForm) => {
    const id = form.value["user_id"];
    const password = form.value["user_password"];
    this.spinner = true;

    this.authService.signIn(id, password)
      .then(response => {
        console.log(response);
        switch (response) {
          case "no account":
            this.error_message = "Aucun compte avec cet identifiant."
            this.spinner = false;
            break;
          case "wrong password":
            this.error_message = "Mot de passe incorrecte."
            this.spinner = false;
            break;
          case "signed in":
            this.booksService.getBooksFromDatabase()
              .then(() => {
                this.spinner = false;
                this.router.navigate(["/"]);
              })
              .catch((error) => console.error("Error: ", error))
            break
        }
      })
      .catch(error => console.error("Error: ", error));
  }

  handleSign = () => {
    if (this.sign === "up") {
      this.sign = "in";
    } else {
      this.sign = "up";
    }
  }



}
