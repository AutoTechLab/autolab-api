import { ValidationOptions } from 'class-validator';

export const ENG_REGEX = 'a-zA-Z';
export const NUM_REGEX = '0-9';

export function validationOptionsMsg (message:string): ValidationOptions {
  return { message };
}