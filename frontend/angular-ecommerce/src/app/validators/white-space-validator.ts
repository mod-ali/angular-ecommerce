import {FormControl, ValidationErrors, Validators} from "@angular/forms";

export class WhiteSpaceValidator {

  static notOnlyWhitespace(control: FormControl): ValidationErrors {

    if ((control.value != null) && (control.value.trim().length === 0)) {
      return {'notOnlyWhitespace': true};
    }
    return null;
  }
}
