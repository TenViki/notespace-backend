import { Injectable } from "@nestjs/common";

@Injectable()
export class FilesService {
  saveFiles(files: Express.Multer.File[]) {}
}
