import { Controller, Get, Param, Post, StreamableFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { createReadStream } from "fs";

@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.saveFiles(files);
  }

  @Get("/:id")
  async getFile(@Param("id") id: string) {
    const filepath = await this.filesService.getFile(id);

    return new StreamableFile(createReadStream(filepath));
  }
}
