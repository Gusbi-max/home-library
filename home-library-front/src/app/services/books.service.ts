import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class BooksService {

    bookFromApi: any;
    library: any = [];

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
    ) {
    }

    // Get book from API by Isbn code
    getBookFromApiByIsbn = (search: string) => {
        return new Promise((resolve, reject) => {
            this.httpClient
            .get<any[]>("https://www.googleapis.com/books/v1/volumes?q=isbn:" + search + "&key=your_api_key")
            .subscribe(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    console.log("Completed !");
                }
        )
        });
    }

    // Update the library in database
    updateLibraryInDatabase = (library: any) => {
        return new Promise((resolve, reject) => {
            this.httpClient
                .post("http://localhost:3000/update-library", { data: library, id:  this.authService.id}, { responseType: "text" })
                .subscribe(
                    (response) => {
                        console.log(response);
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        console.log("Update Database Complete");
                    }
            )
        })
    }

    // Get the user's library
    getBooksFromDatabase = () => {
        return new Promise((resolve, reject) => {
            this.httpClient
            .post("http://localhost:3000/library", { id: this.authService.id })
            .subscribe(
                (response) => {
                    this.library = response;
                    resolve();
                },
                (error) => {
                    reject(error);
                },
                () => {
                    console.log("getBooksFromDatabase Complete");
                }
            )
        })
        
    }

    // Add a book to the user library in local
    addBookToLibrary = (book: any) => {
        this.library.push(book);
        this.updateLibraryInDatabase(this.library)
    }

    // Update loan information
    updateLoanInformation = (book: any, loanDetails: any) => {
        this.library.forEach((element: any, index: number) => {
            if (book.isbn === element.isbn) {
            
                if (this.library[index].onLoan) {
                    this.library[index].onLoan = false;
                    this.library[index].loanDetails = loanDetails;
                    this.updateLibraryInDatabase(this.library);
                } else {
                    this.library[index].onLoan = true;
                    this.library[index].loanDetails = loanDetails;
                    this.updateLibraryInDatabase(this.library);
                }
                
            }
        });
    }

    deleteBook = (index: number) => {
        this.library.splice(index, 1);
        this.updateLibraryInDatabase(this.library);
    }
    
}
