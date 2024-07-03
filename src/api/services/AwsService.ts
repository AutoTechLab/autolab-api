import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid'
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const PATH_TO_AVATARS = 'avatars/'

@Injectable()
export class AwsService {
  private readonly  s3: S3Client;
  private readonly bucketName: string;
  constructor (
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
      region: this.configService.get<string>('S3_REGION'),
    });
  }

  getPathFromLink (link: string) {
    const url = new URL(link);
    return url.pathname.slice(1)
  }

  deleteFile (path: string) {
    const command = new DeleteObjectCommand ({
      Bucket: this.bucketName,
      Key: path,
    });

    return this.s3.send(command);
  }

  async uploadFile (file: Express.Multer.File): Promise<string> {
    const extension = extname(file.originalname)
    const key = `${PATH_TO_AVATARS}${v4()}${extension}`;
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3.send(command);

    return `https://${this.bucketName}.s3.${this.configService.get<string>('S3_REGION')}.amazonaws.com/${key}`;
  }
}