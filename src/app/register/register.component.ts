import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerform = this.fb.group({
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    cpassword: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb: FormBuilder,private api:ApiService,private registerrouter:Router) { }

  //register status
  registerStatus:boolean = false

  // register
  register() {
    let uname = this.registerform.value.username
    let acno = this.registerform.value.acno
    let pswd = this.registerform.value.password
    let cpswd = this.registerform.value.cpassword

    if(this.registerform.valid) {
      // checking confirm password match
      if(pswd==cpswd){
      // call register of apiservice
        this.api.register(acno,uname,pswd)
        .subscribe(
          //200 response code
          (result:any)=>{
           this.registerStatus = true
           setTimeout(() => {
            //redirect to login after 5 sec -navigateByurl() it from Router class
            this.registerrouter.navigateByUrl('')
             }, 5000);
             },
        // 400 response code
        (result:any)=>{
          alert(result.error.message);
          //reset the value of input field
          this.registerform.reset()
        })
          }
     else {
        alert('invalid form')
      }
    }
     
    else {
        alert('invalid form')
      }
    }
  }

