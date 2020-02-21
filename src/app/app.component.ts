import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  genders = ['male', 'female'];
  signUpForm:FormGroup;

  // Names to be forbidden or not allowed
  forbiddenUserNames = ['Naresh','Balaji'];

  ngOnInit(){
    this.signUpForm = new FormGroup({
      'userData':new FormGroup({
        'username' : new FormControl(null,[Validators.required,this.forbiddenNames.bind(this)]),
         // Multiple validations can be added using Array [Validators.required,Validators.email]
        'email': new FormControl(null,[Validators.required,Validators.email], this.forbiddenEmails),
      }),
      
      'gender':new FormControl('female'),
      'hobbies': new FormArray([]) // Dynamically adding Input Textboxes for Hobbies
    });

    // ValueChanges and StatusChanges
    // These are the observables which will be triggered on every change. We can use it for every 
    // Input control if required to track the values and changes
    //this.signUpForm.valueChanges.subscribe((value)=>{console.log(value);})
    //this.signUpForm.statusChanges.subscribe((status)=>{console.log(status);})

    /* SetValue 
       We can use this to set the values while loading or while editing etc.*/
    this.signUpForm.setValue({
      'userData':{
        'username' : 'Karthik JS',
        'email' : 'kartheek.js@gmail.com'
                },
        'gender': 'male',
        'hobbies':[]      
    });

    /* PatchValue
       If you want to update only part of the Form like only Username  */
    this.signUpForm.patchValue({
      'userData':{
        'username' : 'Karthik Jamalpur Sai'
      }
  });
}

  // Form Submit
  public onSubmit():void{
    console.log(this.signUpForm);
    // Reset the form after Submit. If you want controls with default values, we can pass as below.
    this.signUpForm.reset({'gender':'male'}); // Default Gender to Male
    }

  // Adding Input Text Box Control
  onAddHobby(){
    const control = new FormControl(null,Validators.required);
    (<FormArray>this.signUpForm.get('hobbies')).push(control);
  }

  // Custom Validator 
  // It accepts the Control of the Form and returns a KeyValue Pair [s:string]:boolean
  // key-[s:string], value-boolean(true/false)
  forbiddenNames(control:FormControl) : {[s:string]:boolean}{
    if(this.forbiddenUserNames.indexOf(control.value)!==-1){ // If the control value is present in forbiddenUserNames Array.
      return {'nameisForbidden':true};
    }
    return null; // We should never return return {'nameisForbidden':false}; Instead return null or do not write any stmt.
  }


  // Asynchronous Validator 
  // In scenarios we may hit the service and check name is forbidden or not. So it will take 1/2 
  // seconds to get the response. We can handle this using Asynchronous Validators.
  // Here the return type is Promise. We are delaying the response by 1.5 seconds, and returing forbidden message if 
  // email is "test@test.com"  
  forbiddenEmails(control:FormControl) : Promise<any> | Observable<any>{
    const promise = new Promise<any>((resolve,reject)=>{
                                                       setTimeout(()=>{
                                                         if(control.value === "test@test.com")
                                                         {
                                                           resolve({'emailForbidden':true});
                                                         }
                                                         else 
                                                         {
                                                           resolve(null);
                                                         }
                                                       },1500);
    });

    return promise;
  }
}
