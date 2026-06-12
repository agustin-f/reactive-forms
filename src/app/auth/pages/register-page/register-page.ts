import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { formUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private fb = inject(FormBuilder);

  formUtils = formUtils;

  myForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.pattern(formUtils.namePattern)]],
      email: ['', [Validators.required, Validators.pattern(formUtils.emailPattern)]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(formUtils.notOnlySpacesPattern),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    },
    {
      validators: [this.isFieldOneEqualFieldTwo('password', 'password2')],
    },
  );

  isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (FormGroup: AbstractControl) => {
      const field1Value = FormGroup.get(field1)?.value;
      const field2Value = FormGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordNotEqual: true };
    };
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    return null;
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    console.log(this.myForm.value);
  }
}
