import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
  @Output() createTodoEvent: EventEmitter<string> = new EventEmitter<string>();
  todoCreation: FormControl = new FormControl('');
  constructor() {}

  createTodo(): void {
    this.createTodoEvent.emit(this.todoCreation.value);
    this.todoCreation.reset();
  }
}
