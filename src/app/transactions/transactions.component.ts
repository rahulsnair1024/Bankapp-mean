import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  alltransactions:any=[]
  searchterm:string=''
  constructor(private api:ApiService,private transactionRouter:Router) { 

  }


  ngOnInit(): void {
    // check user loggined in or not
   if (!localStorage.getItem('token')){
    alert('please login')
    //redirect to login page
    this.transactionRouter.navigateByUrl('')
   }
    //call ministatement api
    this.api.ministatement()
      .subscribe((result: any) => {
        console.log(result.transactions);
        this.alltransactions = result.transactions
      })
  }

  filter(event:any){
  this.searchterm = event.target.value
  }

  generatePDF(){
    //create  object of jspdf
    var pdf = new jspdf()
    // set up title col
    let col = ['type','fromAcno','toAcno','Amount']
    // set up row
    let row:any = []
   //basic styling of pdf document
    pdf.setFontSize(16)
    pdf.text('MINISTATEMENT',15,10)
    pdf.setFontSize(12)
    pdf.setTextColor(99)

// convert alltransactions array of objects to nested array
  var allitems = this.alltransactions
  for(let item of allitems){
  var temp = [item.type,item.acno,item.toAcno,item.Amount]
   row.push(temp)
 }
   
 // convert nested array to pdf
 (pdf as any).autoTable(col,row,{startY:15})
  //open pdf in another tab in browser
  pdf.output('dataurlnewwindow')
//download table as pdf
 pdf.save('ministatements.pdf')

}
}
