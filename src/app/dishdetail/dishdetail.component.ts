import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment'
import { DishService } from '../services/dish.service';
import {Dish} from '../shared/dish'
import { switchMap } from 'rxjs/operators';
import { visibility, flyInOut, expand } from '../animations/app.animations';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    
    animations: [
      visibility(),
      flyInOut(),
      expand()
    ]

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
    visibility = 'shown';
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
      },

      rating:{
        required:'Rating is required.'
      }
    };
    
  constructor( private dishservice: DishService, 
    private route: ActivatedRoute, private location: Location, 
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

   createForm(){
    this.commentForm = this.fb.group({
      rating: [5],
      comment: ['', [Validators.required]],
      author: ['', [Validators.required,Validators.minLength(2)]],
      date: new Date().toISOString()
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
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
    
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
    
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
      
    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: ''
    });

    
    this.commentFormDirective.resetForm();
    console.log(this.commentFormDirective.form.controls.rating.setValue(5));
  }

}
