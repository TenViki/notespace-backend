import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("files")
export class FilesController {
  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return files;
  }
}
