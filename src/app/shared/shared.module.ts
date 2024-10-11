import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';

@NgModule({
  declarations: [
    Error404PageComponent
  ],
  imports: [
    RouterModule
  ],
  exports: [
    Error404PageComponent
  ]
})
export class SharedModule { }
