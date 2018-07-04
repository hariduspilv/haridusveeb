import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';

export const DATEPICKER_FORMAT = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class FiltersService {

  filterFormItems: any= {
  };

  filterFull:any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) {

  }

  filterParseDate(dateString: string){
    var tmpDate = new Date( dateString );
    var year = tmpDate.getFullYear();
    var month:any = tmpDate.getMonth()+1;
    var day:any = tmpDate.getDate();

    if( month < 10 ){
      month = "0"+month;
    }

    if( day < 10 ){
      day = "0"+day;
    }

    return day+"-"+month+"-"+year;
  }

  filterRetrieveParams(params:object) {
    for( var i in params ){

      if( i.match("date") ){
        this.filterFormItems[i] = _moment(params[i], "DD-MM-YYYY");
      }
      else if( i == "tags" || i == "types" ){
        // skip it and leave it to tags code to retrieve it
      }
      else{
        this.filterFormItems[i] = params[i];
      }
    }
  }

  clearField(name:any){
    this.filterFormItems[name] = '';
  }
  filterSubmit() {

    let urlParams = {};

    for( var i in this.filterFormItems ){
      if( this.filterFormItems[i] == '' ){
        delete this.filterFormItems[i];
      }
      else if( i.match("date") && typeof( this.filterFormItems[i] ) == 'object' && this.filterFormItems[i] !== null){
        urlParams[i] = this.filterParseDate( this.filterFormItems[i] );
      }
      else if( typeof( this.filterFormItems[i] ) == 'object' ){
        let values = '';
        for( let ii in this.filterFormItems[i] ){
          if( values !== '' ){ values+= ','}
          values+= this.filterFormItems[i][ii].id;
        }
        urlParams[i] = values;
      }
      else{
        urlParams[i] = this.filterFormItems[i];
      }
    }

    this.router.navigate([], {
      queryParams: urlParams,
      replaceUrl: true
    });

  }

}