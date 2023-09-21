import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(alltransactions:any[],searchterm:string,transactiontype:string):any[] {
    const result:any = []
  if(!alltransactions || searchterm=='' || transactiontype==''){
    return alltransactions
  }
  alltransactions.forEach(item=>{
    if(item[transactiontype].trim().toLowerCase().includes(searchterm.trim().toLowerCase())){
      result.push(item)
    }
  })

  return result;
  }
}
