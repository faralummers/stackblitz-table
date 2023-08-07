import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Todos } from '../../interfaces/todos.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements AfterViewInit {
  @Input() set todos(value: Todos[]) {
    if (value) {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.sort = this.sort;
    }
  }
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() editEvent: EventEmitter<Todos> = new EventEmitter<Todos>();
  @Output() sortEvent: EventEmitter<Sort> = new EventEmitter<Sort>();
  displayedColumns: string[] = ['Users', 'title', 'Edit', 'Delete'];
  dataSource = new MatTableDataSource(this.todos);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  deleteTodo(id: number): void {
    this.deleteEvent.emit(id);
  }

  editTodo(todo: Todos): void {
    this.editEvent.emit(todo);
  }

  sortTodo(sortState: Sort): void {
    //this.sortEvent.emit(sortState);
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
