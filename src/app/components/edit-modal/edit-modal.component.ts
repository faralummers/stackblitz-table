import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from '../../app.component';
import { FormControl } from '@angular/forms';
import { Todos } from '../../interfaces/todos.interface';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditModalComponent {
  todoEdit: FormControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Todos
  ) {}

  cancelEdit(): void {
    this.dialogRef.close();
  }

  editTodo(): void {
    const copyTodos = { ...this.data, title: this.todoEdit.value };
    this.dialogRef.close(copyTodos);
  }
}
