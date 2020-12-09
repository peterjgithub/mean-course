import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.component.html',
  styleUrls: ['post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: "First Post", content: "This is the first post's content"},
  //   {title: "Second Post", content: "This is the Second post's content"},
  //   {title: "Third Post", content: "This is the Third post's content"},
  // ]

  posts: Post[] =[];
  isLoading = false;
  private postsSub: Subscription;

  //this constructor is angular dependency injection :)
  constructor(public postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      }
      );
      //1 when new data is emitted
      //2 on error is emitted (=never in our case)
      //3 when the observable is completed, there are no more values to be expected (=never in our case)
    //throw new Error('Method not implemented.');
  }
  //public creates a property postsService and stores the incoming value in that property
  //this avoids
  // postsService: PostsService;
  // this.postsService = this.postsService;

  // this file doesn't know the existece of the postsService file
  // add @Injectable({providedIn: 'root'}) to the posts.service.ts
  // (and import Injectable)
  // (manual alternative) add postsService to the providers in app.module.ts

  onDelete( postId: string) {
    this.postService.deletePost(postId);
  };

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}