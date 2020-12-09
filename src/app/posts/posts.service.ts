import { PortalHostDirective } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router){};

  getPosts() {
    // return this.posts;
    // this is dirty: when Posts is changing somewhere, it will update everywhere
    // we prefer to keep posts[] "unmutable"
    // with an event driven approach where we push the info about the new posts
    // to those components that are interested
    // not using Eventemitter because that is ment to be used with the @output decorator
    // better: rsjs package (observables)

    // return [...this.posts];
    this.http
      .get<{message:string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id //db field is _id while angular field is id without _
          };
        });
      }))
      .subscribe((transformedPosts) => {
        console.log(transformedPosts);
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id:string) {
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
    //return {...this.posts.find(p =>  p.id === id)};
    //p =>  p.id === id) pass id to a new object (as argument)
    // if the post we're looking at is the same id?
  }

  addPost(title: string, content:string, image: File) {
    //const post: Post = {id: null, title: title, content: content};
    // updated in order to upload files
    const postData = new FormData(); //allows us to combine txt & blogs
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title) // title is used as filename to provide to the backend
    // image is the property we are trying to access in nodejs backend
    this.http
      .post<{message:string, postId: string}>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData)=> {
      //success
      // console.log(responseData.message);     //contains the new id
        const post: Post = {
          id: responseData.postId,
          title: title,
          content: content,
        };
        //we don't get the image back yet, we will do next lines this later
        //const id = responseData.postId;
        //post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]); // "/" = back to root
      })
  }

  updatePost(id: string, title:string, content:string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
    };
    //backend route to send this request to
    this.http
      .put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => {
        // not so important: we do a local update here (could also be a server update)
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        //findIndex(p => p.id === post.id) = check if id equals updated post
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]); // "/" = back to root
    });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(()=>{
        // console.log('app/posts/posts.service.ts: Deleted!');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  };
}