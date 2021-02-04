import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content }
    this.http.post<{ name: string }>('https://ng-guide-78480-default-rtdb.firebaseio.com/posts.json', postData).subscribe(responseData => {
      console.log(responseData);
    }, error => {
      this.error.next(error.message);
    });
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>('https://ng-guide-78480-default-rtdb.firebaseio.com/posts.json').pipe(map(responseData => {
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key });
        }
      }
      return postsArray;
    }), catchError(errorRes => {
      return throwError(errorRes);
    }));
  }

  clearPosts() {
    return this.http.delete('https://ng-guide-78480-default-rtdb.firebaseio.com/posts.json');
  }
}
