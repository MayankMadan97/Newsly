import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Observable, catchError, forkJoin, interval, map, of, switchMap, timer } from 'rxjs';

interface Topics {
  technology: any;
  business: any;
  sports: any;
  international: any;
  politics: any;
  science: any;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public subscriptionForm: FormGroup;
  public submitted = false;


  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.subscriptionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      technology: [false],
      business: [false],
      science: [false],
      sports: [false],
      international: [false],
      politics: [false],
    });
  }

  onSubmit() {
    // If the form is invalid, do not proceed further
    if (this.subscriptionForm.invalid) {
      return;
    }

    // Form is valid, make the POST request
    const formData = this.subscriptionForm.value;
    this.http.post<any>('https://h4o5frb103.execute-api.us-east-1.amazonaws.com/dev/subscribe', {
      "email": this.subscriptionForm.value.email,
      "preferences": {
        "technology": this.subscriptionForm.value.technology,
        "business": this.subscriptionForm.value.business,
        "sports": this.subscriptionForm.value.sports,
        "international": this.subscriptionForm.value.international,
        "politics": this.subscriptionForm.value.politics,
        "science": this.subscriptionForm.value.science
      }
    }).subscribe(
      (response) => {
        // Handle the response here
        console.log('Response:', response);
      },
      (error) => {
        // Handle any errors here
        console.error('Error:', error);
      }
    );
    this.submitted = true;

    const topics: Topics = {
      "technology": this.subscriptionForm.value.technology,
      "business": this.subscriptionForm.value.business,
      "sports": this.subscriptionForm.value.sports,
      "international": this.subscriptionForm.value.international,
      "politics": this.subscriptionForm.value.politics,
      "science": this.subscriptionForm.value.science
    };

    // let observables = this.getObservables((Object.keys(topics) as (keyof Topics)[]).filter(topic => !!topics[topic]));


    // const timerSubscription$ = timer(0, 10000)
    //   .pipe(
    //     switchMap(() => forkJoin(observables))
    //   )
    //   .subscribe((responses: Array<[{ status: boolean }, string]>) => {
    //     console.log(responses);
    //     observables = this.getObservables(responses.filter(resp => !resp[0].status).map(resp => resp[1]));
    //     if (observables.length == 0) {
    //       timerSubscription$.unsubscribe();
    //     }
    //   });
  }



  // getObservables(topicArr: Array<string>): Array<Observable<any>> {
  //   return topicArr.map(topic => {
  //     const url = ` https://z64q5fglrh.execute-api.us-east-1.amazonaws.com/dev/sendwelcomemail`;
  //     return this.http.post(url, { email: this.subscriptionForm.value.email, topic: topic }).pipe(
  //       catchError((error) => {
  //         console.error(`Error sending welcome email for topic '${topic}':`, error);
  //         // Handle the error as needed
  //         return []; // Return an empty array or any default value to prevent the outer observable from terminating
  //       })
  //       , map((response) => ([response, topic])));
  //   });
  // }
}

