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

      if (file.mimetype.includes("image")) {
        buffer = await sharp(buffer)
          .jpeg({ quality: +process.env.IMAGE_QUALITY })
          .withMetadata()
          .toBuffer();
        extension = "jpg";
      }

      const fileEntity = await this.repo.save({
        originalname: `${file.originalname.split("." + extension)[0]}.${extension}`,
        filename: `${file.filename}.${extension}`,
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

    const filePath = `uploads/${file.filename}`;

    console.log(filePath);

    try {
      await fs.access(filePath);
    } catch (error) {
      throw new InternalServerErrorException("Error reading file");
    }

    return filePath;
  }
}
