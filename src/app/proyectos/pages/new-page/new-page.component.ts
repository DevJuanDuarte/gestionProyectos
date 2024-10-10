import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

  public proyectoForm = new FormGroup({
    id: new FormControl<number | string | null>(null),
    name: new FormControl<string>('', { nonNullable: true }),
    email: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    website: new FormControl<string | null>(null),
  });

  constructor(
    private proyectosService: ProyectosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.proyectosService.getProyectoById(id)),
      ).subscribe(proyecto => {
        if (!proyecto) return this.router.navigateByUrl('/');

        this.proyectoForm.reset({
          ...proyecto,
          id: proyecto.id.toString(), // Convertir id a string para el formulario
        });
        return;
      });
  }

  get actualProyecto(): Proyecto {
    const formValue = this.proyectoForm.value;
    const proyecto: Proyecto = {
      id: parseInt(formValue.id as string, 10),
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      // address: formValue.address ?? '', // Convertir de string a objeto si es necesario
      phone: formValue.phone ?? '',
      website: formValue.website ?? ''
    };
    return proyecto;
  }

  onSubmit(): void {
    console.log({
      formIsValid: this.proyectoForm.valid,
      value: this.proyectoForm.value
    });
    if (this.proyectoForm.invalid) return;

    if (this.actualProyecto.id) {
      this.proyectosService.updateProyecto(this.actualProyecto)
        .subscribe(proyecto => {
          // Mostrar snack de registro actualizado
          this.router.navigate(['/proyectos/list']);
          this.showSnackBar(`Proyecto ${this.actualProyecto.name} actualizado correctamente.`);
        });
      return;
    }

    this.proyectosService.addProyecto(this.actualProyecto)
      .subscribe(proyecto => {
        // Mostrar snack y redirigir
        this.router.navigate(['/proyectos/list']);
        this.showSnackBar(`Proyecto ${this.actualProyecto.name} agregado correctamente.`);
      });
  }

  onDelProject() {
    if (!this.actualProyecto.id) throw Error('El proyecto es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.proyectoForm.value,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      // console.log('eliminado');
      this.proyectosService.deleteProyecto(this.actualProyecto.id).subscribe(() => {
        this.router.navigate(['/proyectos/list']);
        this.showSnackBar(`Proyecto ${this.actualProyecto.name} eliminado correctamente.`);
      });
    });
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
