import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '' , component: PostListComponent},
  // path: '' = empty path
  { path: 'create', component:PostCreateComponent },
  { path: 'edit/:postId', component:PostCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  //forRoot = method
  exports: [RouterModule]
  //now this can be used extnernally
})

export class AppRoutingModule { }
