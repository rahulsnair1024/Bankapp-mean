import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


const options={
  headers:new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  // register api call
  register(acno:any,uname:any,pswd:any) {
    const body={
     acno,
     uname,
     pswd
    }
   // server register Api - post
  return this.http.post('http://localhost:3000/register',body)
  }

  //login Api
  login(acno:any,pswd:any){
    const body={
      acno,
      pswd
    }
    //server login Api
  return this.http.post('http://localhost:3000/login',body)
  }
  
// add token to request header
appendToken(){
// to get token from localstorage
const token = localStorage.getItem('token')
// create request header
let headers = new HttpHeaders()
if(token){
// apppend token in verify-token as key in header
headers=headers.append('verify-token',token)
options.headers = headers
}
return options
}
  
  //getBalance
  getbalance(acno:any){
    //server call to get balance for requested acno
 return this.http.get('http://localhost:3000/getbalance/'+acno,this.appendToken())
  }

  fundTransfer(toAcno:any,pswd:any,amount:any){
     const body={
      toAcno,
      pswd,
      amount
     }

     //api call
   return this.http.post("http://localhost:3000/fund-transfer",body,this.appendToken())  
  }

  //transaction-history api
  ministatement(){
   //api for transaction History
   return this.http.get('http://localhost:3000/transaction-history',this.appendToken())
  }


  deleteacno(){
  return this.http.delete('http://localhost:3000/delete-account',this.appendToken())
  }
  
}

