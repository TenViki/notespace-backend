import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "src/entities/file.entity";
import { Repository } from "typeorm";
import * as sharp from "sharp";
import * as fs from "fs/promises";

@Injectable()
export class FilesService {
  constructor(@InjectRepository(FileEntity) private readonly repo: Repository<FileEntity>) {}

  async saveFiles(files: Express.Multer.File[]) {
    const createdFiles = [];

    for (const file of files) {
      let buffer = file.buffer;
      let extension = file.originalname.split(".").pop();

      if (file.mimetype.includes("image")) {
        buffer = await sharp(buffer)
          .jpeg({ quality: +process.env.IMAGE_QUALITY })
          .withMetadata()
          .toBuffer();
        extension = "jpg";
      }

      const fileEntity = await this.repo.save({
        filename: `${file.originalname.split("." + extension)[0]}.${extension}`,
      });

      const filePath = `uploads/${fileEntity.id}.${extension}`;
      await fs.writeFile(filePath, buffer);

      createdFiles.push(fileEntity);
    }

    return createdFiles;
  }

  async getFile(id: string) {
    const file = await this.repo.findOne(id);

    if (!file) {
      throw new NotFoundException("File not found");
    }

    const filePath = `uploads/${file.filename}`;

    try {
      await fs.access(filePath);
    } catch (error) {
      throw new NotFoundException("File not found");
    }

    return filePath;
  }
}
