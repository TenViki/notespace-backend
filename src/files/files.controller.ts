import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.saveFiles(files);
  }
}
