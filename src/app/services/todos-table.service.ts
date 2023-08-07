import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todos } from '../interfaces/todos.interface';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  url = 'https://jsonplaceholder.typicode.com/todos';
  constructor(private http: HttpClient) {}

  getTodosList(): Observable<Todos[]> {
    return this.http.get<Todos[]>(this.url);
  }

  createTodo(title: string): Observable<Todos> {
    return this.http.post<Todos>(this.url, {
      title,
    });
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  editTodo(todo: Todos): Observable<Todos> {
    return this.http.put<Todos>(`${this.url}/${todo.id}`, todo);
  }
}
