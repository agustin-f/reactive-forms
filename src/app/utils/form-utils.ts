import { FormArray, FormGroup } from '@angular/forms';

export class formUtils {
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor minimo de ${errors['min'].min} caracteres`;
      }

      return null;
    }
    return null;
  }

  static isValidFieldInArray(FormArray: FormArray, index: number) {
    return FormArray.controls[index].errors && FormArray.controls[index].touched;
  }
}
