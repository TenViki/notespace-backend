import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "src/entities/note.entity";
import { Tag } from "src/entities/tag.entity";
import { FilesModule } from "src/files/files.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([Tag, Note])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
