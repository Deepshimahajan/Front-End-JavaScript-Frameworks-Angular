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
    @ViewChild('cform') feedbackFormDirective;
    dish: Dish;
    dishIds: number[];
    prev: number;
    next: number;
    errMess: string;
    dishErrMess: string;

    commentForm: FormGroup;
    newcomment: Comment;
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
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(+params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
    errmess => this.dishErrMess = <any>errmess.message);
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
    this.newcomment = this.commentForm.value;
    const date: Date = new Date();
    this.newcomment.date = date.toString();
    console.log(this.newcomment);
    this.commentForm.reset();
    this.feedbackFormDirective.resetForm({rating:5,author:'',comment:''});
    this.dish.comments.push(this.newcomment);
  }

  matcher = new MyErrorStateMatcher();

}
