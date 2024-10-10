import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent {

  public proyectoForm = new FormGroup({
    id:       new FormControl<string>(''),
    name:     new FormControl<string>('', {nonNullable:true}),
    email:    new FormControl<string>(''),
    address:  new FormControl<string>(''),
    phone:    new FormControl<string>(''),
    website:  new FormControl<string>(''),
  });


  onSubmit():void {
    console.log({
      formIsValid: this.proyectoForm.valid,
      value: this.proyectoForm.value
    });
  }

}
