import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { eventsRegister } from '@app/_services/events/events.graph';
@Component({
  selector: 'events-registration-dialog',
  templateUrl: 'events.registration.dialog.html',
  styleUrls: ['../modal/modal.scss']
})
export class EventsRegistratonDialog {
  
  form: FormGroup;
  
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  telephone: string;
  marked: string;
  step: number = 0;
  lang: any;
  loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventsRegistratonDialog>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public route: ActivatedRoute
  ) { }
  
  
  ngOnInit() {

    this.form = this.fb.group({
      firstName: [this.firstName, [Validators.required]],
      lastName: [this.lastName, [Validators.required]],
      companyName: [this.companyName, []],
      telephone: [this.telephone, []],
      email: [this.email, [Validators.required, Validators.email]],
      marked: [this.marked, []]
    });
    // this.form.valueChanges.subscribe()
  }  
  
  save() {
    this.loader = true;
    const register = this.apollo.mutate({
      mutation: eventsRegister,
      variables: {
        event_id: this.data.nid,
        lang: this.data.lang.toUpperCase(),
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
        companyName: this.form.controls.companyName.value,
        telephone: this.form.controls.telephone.value,
        email: this.form.controls.email.value,
        marked: this.form.controls.marked.value,
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
    })
    .subscribe(({data}) => {
      this.step = 1;
      this.loader = false;
    }, (data) => {
      console.log(data);
      this.loader = false;
    });
  }
  
  close() {
    this.dialogRef.close();
  }
  
  clear() {
    this.form.reset();
  }

  isInvalidField(field): boolean {
    return this.form.controls[field].invalid && this.form.controls[field].value && this.form.controls[field].dirty
  }
}
