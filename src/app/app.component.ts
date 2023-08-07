import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import {
  combineLatest,
  filter,
  first,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { Todos } from './interfaces/todos.interface';
import { TodosService } from './services/todos-table.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  todos$!: Observable<Todos[]>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private todosService: TodosService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.getTodoList();
  }

  sortTodos(sort: Sort): void {
    console.log(sort, 'sortttt')
    if (sort.direction) {
      this._liveAnnouncer.announce(`Sorted ${sort.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  editTodo(todo: Todos): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: todo,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        switchMap((todoEditValue: Todos) => {
          return combineLatest([
            this.todosService.editTodo(todoEditValue),
            this.todos$,
          ]);
        }),
        map(([todoEdit, todos]: [Todos, Todos[]]) => {
          return todos.map((todo: Todos) => {
            if (todo.id === todoEdit.id) {
              todo.title = todoEdit.title;
            }
            return todo;
          });
        })
      )
      .subscribe((result: Todos[]) => {
        if (result) {
          this.todos$ = of(result);
          this._snackBar.open('Todo edited', 'Cancel', {
            duration: 2000,
          });
        }
      });
  }

  createTodo(title: string): void {
    this.todosService
      .createTodo(title)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((todo) =>
          this.todos$.pipe(
            map((todos) => [
              ...todos,
              {
                ...todo,
                id: todos.length + 1,
                userId: this.modifyUserId(Math.random()),
                completed: false,
              },
            ])
          )
        )
      )
      .subscribe((todos) => {
        this.todos$ = of(todos);
        setTimeout(() => {
          this._snackBar.open('Todo created', 'Cancel', {
            duration: 2000,
          });
          window.scrollTo(0, document.body.scrollHeight);
        });
      });
  }

  deleteTodo(id: number): void {
    this.todosService
      .deleteTodo(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.todos$.pipe(
            map((todos) => {
              return todos.filter((todo) => todo.id !== id);
            })
          )
        )
      )
      .subscribe((todos) => {
        this.todos$ = of(todos);
        this._snackBar.open('Todo deleted', 'Cancel', {
          duration: 2000,
        });
      });
  }

  private getTodoList(): void {
    this.todos$ = this.todosService.getTodosList().pipe(
      takeUntilDestroyed(this.destroyRef),
      map((todos: Todos[]) =>
        todos.map((todo: Todos) => {
          todo.userId = this.modifyUserId(todo.userId);
          return todo;
        })
      )
    );
  }

  private modifyUserId(userId: number | string): string {
    switch (userId) {
      case 1:
        userId = 'admin';
        return userId;
      case 2:
        userId = 'tester';
        return userId;
      default:
        userId = 'neznámý uživatel';
        return userId;
    }
  }
}
