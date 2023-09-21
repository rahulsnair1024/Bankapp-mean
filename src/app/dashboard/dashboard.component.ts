import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BlockLike } from 'typescript';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  iscollapse: boolean = true
  currentUser: string = ""
  userbalance: number = 0
  currentAcno: any
  fundtransfersuccessmsg: string = ''
  fundtransfererrormsg: string = ''
  logoutstatus: boolean = false
  deleteconfirmstatus:boolean = false
  deleteacno:any
  deletemsg:string= ""



  constructor(private fb: FormBuilder, private api: ApiService, private dashboardrouter: Router) { }


  fundTransferform: any = this.fb.group({
    creditAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })




  ngOnInit(): void {
    // check user loggined in or not
   if(!localStorage.getItem('token')){
      alert(' please login')
      this.dashboardrouter.navigateByUrl('')
   }
    //get currrentUser from local storage
    this.currentUser = localStorage.getItem("currentUser") || ""
    // get currentAcno from local storage
    this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || "")
    console.log(typeof (this.currentAcno));
  }

  //getbalance
  getbalance() {
    // api call to get balance
    this.api.getbalance(this.currentAcno)
      .subscribe((result: any) => {
        this.userbalance = result.balance
      },
        (result: any) => {
          alert(result.error.message)
        })
  }



  collapse() {
    this.iscollapse = !this.iscollapse
  }

  // transfer()
  transfer() {
    if (this.fundTransferform.valid) {
      let toAcno = this.fundTransferform.value.creditAcno
      let fromAcnopswd = this.fundTransferform.value.password
      let amount = this.fundTransferform.value.amount


      //api call
      this.api.fundTransfer(toAcno, fromAcnopswd, amount)
        .subscribe(
          //200
          (result: any) => {
            this.fundtransfersuccessmsg = result.message
            setTimeout(() => {
              this.fundTransferform.reset()
              this.fundtransfererrormsg = ""
              this.fundtransfersuccessmsg = ""
            }, 5000);
          },

          //400
          (result: any) => {
            this.fundtransfererrormsg = result.error.message
          })
    }
    else {
      alert("invalid form")
    }
  }

  //resetform()
  resetform() {
    // reset transfer form
    this.fundTransferform.reset()
    //reset error and success msg to empty
    this.fundtransfersuccessmsg = ""
    this.fundtransfererrormsg = ""
  }

  //logout()
  logout() {

    //remove all login details from localstorage
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('urrentAcno')

    //set true as logoutstatus
    this.logoutstatus = true
    setTimeout(() => {
      //redirect to login page
      this.dashboardrouter.navigateByUrl('')
   },3000)
}

deletemyaccount(){
  // set deleteconfirmstatus as true
  this.deleteconfirmstatus = true
  // get acno to be deleted
  this.deleteacno = this.currentAcno
}

canceldeleteconfirm(){
  // to hide child deleteconfirm view
  this.deleteacno =""
  //set deleteconfirmstatus  as false
  this.deleteconfirmstatus = false
}

//deletefromparent
deletefromparent(event:any){
  //alert('Alert from parent' +event)
  this.deleteacno =""
  // make api call to delete acno
  this.api.deleteacno()
  .subscribe((result:any)=>{
    // display delete msg
    this.deletemsg = result.message
    // remove logindetails from local storage
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentAcno')
  setTimeout(()=>{
    this.dashboardrouter.navigateByUrl('')
  },3000)
  },
  (result:any)=>{
    this.deletemsg = result.error.message
  })
}
}
