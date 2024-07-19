import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { extname } from 'path';
import { InvalidExtensionException } from '../../utils/exceptions/InvalidExtensionException';
import { TooLargeSizeException } from '../../utils/exceptions/TooLargeSizeException';

const AVATAR_MAX_SIZE = 1048576;
const AVATAR_EXTENSIONS: string[] = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

@Injectable()
export class FileValidation implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) throw new NotFoundException('File is not found');

    const ext = extname(file.originalname);

    if (!AVATAR_EXTENSIONS.includes(ext)) {
      throw new InvalidExtensionException();
    }

    if (file.size > AVATAR_MAX_SIZE) {
      throw new TooLargeSizeException('1 MB');
    }

    return file;
  }
}