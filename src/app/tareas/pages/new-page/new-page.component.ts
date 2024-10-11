import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TareasService } from 'src/app/proyectos/services/tareas.service';
import { Tarea } from 'src/app/proyectos/interfaces/tarea.interface';
import { ConfirmDialogComponent } from 'src/app/proyectos/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

  public tareaForm = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl<string>('', { nonNullable: true }),
    completed: new FormControl<boolean>(false)
  });

  constructor(
    private tareasService: TareasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.tareasService.getTareaById(id))
      ).subscribe(tarea => {
        if (!tarea) {
          this.router.navigateByUrl('/tareas/list');
          return; // Asegúrate de salir del flujo si la tarea no existe
        }

        this.tareaForm.reset({
          ...tarea,
          id: tarea.id
        });
      });
  }

  get actualTarea(): Tarea {
    const formValue = this.tareaForm.value;
    return {
      id: formValue.id!,
      title: formValue.title ?? '',
      completed: formValue.completed ?? false,
      userId: 1
    };
  }

  onSubmit(): void {
    if (this.tareaForm.invalid) return;

    if (this.actualTarea.id) {
      this.tareasService.updateTarea(this.actualTarea)
        .subscribe(() => {
          this.router.navigate(['/tareas/list']);
          this.showSnackBar(`Tarea ${this.actualTarea.title} actualizada correctamente.`);
        });
      return;
    }

    this.tareasService.addTarea(this.actualTarea)
      .subscribe(() => {
        this.router.navigate(['/tareas/list']);
        this.showSnackBar(`Tarea ${this.actualTarea.title} creada correctamente.`);
      });
  }

  // onDelete(): void {
  //   if (!this.actualTarea.id) return;

  //   this.tareasService.deleteTarea(this.actualTarea.id)
  //     .subscribe(() => {
  //       this.router.navigate(['/tareas/list']);
  //       this.showSnackBar(`Tarea ${this.actualTarea.title} eliminada correctamente.`);
  //     });
  // }

  onDelete() {
    if (!this.actualTarea.id) throw Error('La tarea es requerida');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.tareaForm.value,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      // console.log('eliminado');
      this.tareasService.deleteTarea(this.actualTarea.id).subscribe(() => {
        this.router.navigate(['/tareas/list']);
        this.showSnackBar(`Tarea ${this.actualTarea.title} eliminada correctamente.`);
      });
    });
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
