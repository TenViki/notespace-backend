import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "src/entities/file.entity";
import { Note } from "src/entities/note.entity";
import { Tag } from "src/entities/tag.entity";
import { FilesService } from "src/files/files.service";
import { Between, Repository } from "typeorm";
import { NewNoteDto } from "./new-note.dto";
import {} from "typeorm";
import { TagsService } from "src/tags/tags.service";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private repo: Repository<Note>,
    private tagsService: TagsService,
    private filesService: FilesService,
  ) {}

  async createNote(note: NewNoteDto) {
    const tag = await this.tagsService.getTag(note.tag);

    const files: FileEntity[] = [];
    for (const fileId of note.files) {
      const file = await this.filesService.getFileById(fileId);
      files.push(file);
    }

    return this.repo.save({
      tag,
      label: note.label,
      content: note.content,
      files,
      created: new Date(),
      forDay: this.getDateDay(new Date(note.forDay)),
    });
  }

  async getNotesForMonth(year: number, month: number) {
    return this.repo.find({
      where: { forDay: Between(this.getDateMonth(year, month).toISOString(), this.getDateMonth(year, month + 1).toISOString()) },
      relations: ["tag"],
    });
  }

  getDateMonth(year: number, month: number) {
    return new Date(year, +month - 1, 1);
  }

  async getNote(id: string) {
    const note = this.repo.findOne(id, { relations: ["tag", "files"] });
    if (!note) throw new NotFoundException(`Note with id ${id} not found`);
    return note;
  }

  getDateDay(date: Date) {
    // Strip out the time portion of the date
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
