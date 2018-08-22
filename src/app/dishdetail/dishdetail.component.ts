// import { Component, OnInit, Input } from '@angular/core';
import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment'

import { DishService } from '../services/dish.service';
import {Dish} from '../shared/dish'
import { switchMap } from 'rxjs/operators';

import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
    // @Input()
    @ViewChild('cform') commentFormDirective;
    dish: Dish;
    dishIds: number[];
    prev: number;
    next: number;
    errMess: string;
    dishErrMess: string;
    dishcopy = null;
    commentForm: FormGroup;
    comment: Comment;
    formErrors = {
      'author': '',
      'comment': ''
    };
    validationMessages = {
      author:{
        minlength:'Name must be at least 2 characters long.',
        required:'Name is required.'
      },
      comment:{
        required:'Comment is required.'
      }
    };
    
  constructor( private dishservice: DishService,private route: ActivatedRoute, private location: Location,private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
   }

   createForm(){
    this.commentForm = this.fb.group({
      rating: [5],
      comment: ['', [Validators.required]],
      author: ['', [Validators.required,Validators.minLength(2)]]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && (control.dirty || !control.valid)) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }



  ngOnInit() {
    this.route.params
      .pipe(switchMap((params: Params) => { return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
          errmess => { this.dish = null; this.errMess = <any>errmess; });
    // const id = +this.route.snapshot.params['id'];
    // this.dishservice.getDish(id).subscribe(idish => this.dish=idish);
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: ''
    });

    
    this.commentFormDirective.resetForm();
    console.log(this.commentFormDirective.form.controls.rating.setValue(5));
  }

  matcher = new MyErrorStateMatcher();

}
