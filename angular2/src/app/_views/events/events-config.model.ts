import * as _moment from 'moment';
const moment = _moment;

export class EventsConfig {
  
  constructor(
    public tagsValue: string = "",
    public tagsEnabled: boolean = false,
    public typesValue: string = "",
    public typesEnabled: boolean = false,
    public titleValue: string = "",
    public titleEnabled: boolean = false,
    public dateFrom: string = moment().format('YYYY-MM-DD').toString(), //"1901-00-00" TODAY
    public dateTo: string = moment("2038-01-01").format('YYYY-MM-DD').toString(), //"2038-01-01"
    public offset: number = 0,
    public limit: number = 5
  ) {
    this.tagsValue = tagsValue;
    this.tagsEnabled = tagsEnabled;
    this.typesValue = typesValue;
    this.typesEnabled = typesEnabled;
    this.titleValue = titleValue;
    this.titleEnabled = titleEnabled;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.offset = offset;
    this.limit = limit;
  }

  getApollo(language) {
    let obArr = {
      tagsValue: this.tagsValue,
      tagsEnabled: this.tagsEnabled,
      typesValue: this.typesValue,
      typesEnabled: this.typesEnabled,
      titleValue: "%" + this.titleValue + "%",
      titleEnabled: this.titleEnabled,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      offset: this.offset,
      limit: this.limit,
      lang: language
    };
    return obArr
  }

}