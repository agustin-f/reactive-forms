import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.html',
  styleUrl: './dynamic-page.css',
})
export class DynamicPage {
  private fb = inject(FormBuilder);
  formUtils = formUtils;

  myForm = this.fb.group({
    name: ['', Validators.required, Validators.minLength(3)],
    favoriteGames: this.fb.array(
      [
        ['Metal Gear', Validators.required],
        ['Dead Stranding', Validators.required],
      ],
      Validators.minLength(3),
    ),
  });

  newFavorite = this.fb.control(['', Validators.required]);

  i: number | undefined;

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  onAddToFavorites() {
    if (this.newFavorite.invalid) return;
    const newGame = this.newFavorite.value;

    this.favoriteGames.push(this.fb.control(newGame, Validators.required));

    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);
  }

  onSubmit() {
    console.log(this.myForm.value);
    this.myForm.markAllAsTouched();
  }
}
