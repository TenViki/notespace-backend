import { Controller, Get, Param, Post, Response, StreamableFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { createReadStream } from "fs";
import { Response as Res } from "express";

@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.saveFiles(files);
  }

  @Get("/:id")
  async getFile(@Param("id") id: string, @Response({ passthrough: true }) res: Res) {
    const file = await this.filesService.getFile(id);

    res.set({
      "Content-Type": file.mimetype,
      "Content-Disposition": `inline; filename="${file.originalname}"`,
    });

    return new StreamableFile(createReadStream(`uploads/${file.filename}`));
  }
}
