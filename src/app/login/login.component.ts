import { Component } from '@angular/core';
import { FormBuilder, SelectControlValueAccessor, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //success msg
  successMsg:boolean = false

  //error msg
  errorMsg:string =""

  loginform = this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb:FormBuilder,private api:ApiService,private loginrouter:Router) {}

  login(){
    if(this.loginform.valid){
    let acno = this.loginform.value.acno
    let password = this.loginform.value.password
    // api call to login
     this.api.login(acno,password)
     .subscribe(
      (result:any)=>{
        //login success
        this.successMsg = true
        //get username from result and store it in localstorage
         localStorage.setItem("currentUser",result.currentUsername)
         //get currentAcno from result and store it in localstorage
         localStorage.setItem("currentAcno",result.currentAcno)
         // get token from result and store it in localstorage
         localStorage.setItem("token",result.token)
        //code to redirect after 3 sec
        setTimeout(()=>{
        this.loginrouter.navigateByUrl('dashboard') 
        },3000)
     },
     (result:any)=>{
       this.errorMsg = result.error.message
       // after 3 sec reset login form and error msg
       setTimeout(()=>{
        this.loginform.reset()
        this.errorMsg = ""
       },3000);
    })
    }
    else{
      alert('invalid form')
    }
  }
}
