import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:  ['post-create.component.css'],
})

export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode= 'create';
  private postId: string;

  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(3),
      ]}),
      'content': new FormControl (null, {validators: [Validators.required]}),
      'image': new FormControl (null, { validators: [Validators.required], asyncValidators: [mimeType]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData._id, title: postData.title, content: postData.content};
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
            });
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
        //postId is the param we add when triggering post-create from app-routing.module.ts
    });
    //paramMap is an observable, that could change once we are on the page
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image:file }); //target a single control, not all
    this.form.get('image').updateValueAndValidity();
      //informs ng that I change the value
      // and that it should re-validate that
      // store that value internally
      // and check if the value I did patch is valid
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost(){
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode==='create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
      );
    }
  this.form.reset();
  }
}