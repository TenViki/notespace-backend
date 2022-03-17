import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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
      let mimetype = file.mimetype;

      if (file.mimetype.includes("image")) {
        buffer = await sharp(buffer)
          .jpeg({ quality: +process.env.IMAGE_QUALITY })
          .withMetadata()
          .toBuffer();
        extension = "jpg";
        mimetype = "image/jpeg";
      }

      const fileEntity = await this.repo.save({
        originalname: `${file.originalname.split("." + extension)[0]}.${extension}`,
        filename: `${file.filename}.${extension}`,
        mimetype,
      });

      const filePath = `uploads/${fileEntity.id}.${extension}`;
      fileEntity.filename = `${fileEntity.id}.${extension}`;
      await this.repo.save(fileEntity);
      await fs.writeFile(filePath, buffer);

      createdFiles.push(fileEntity);
    }

    return createdFiles;
  }

  async getFile(id: string) {
    const file = await this.repo.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException("File not found");
    }

    try {
      await fs.access(`uploads/${file.filename}`);
    } catch (error) {
      throw new InternalServerErrorException("Error reading file");
    }

    return file;
  }

  async getFileById(id: string) {
    const file = await this.repo.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException("File not found");
    }

    return file;
  }
}
