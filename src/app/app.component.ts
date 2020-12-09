import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}

  // we can remove the event bindings here
  // original (with bindings):
  // export class AppComponent {
  //   title = 'mean-course';
  //   storedPosts: Post[] =[];

  //   onPostAdded(post: any) {
  //     this.storedPosts.push(post);
  //   }
