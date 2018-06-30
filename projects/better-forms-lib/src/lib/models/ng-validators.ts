import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';

export type SyncNgValidator = Validator | ValidatorFn;
export type AsyncNgValidator = AsyncNgValidator | AsyncValidatorFn;
export type NgValidator = SyncNgValidator | AsyncValidatorFn;
