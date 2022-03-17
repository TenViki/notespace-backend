import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "src/entities/file.entity";
import { Note } from "src/entities/note.entity";
import { Tag } from "src/entities/tag.entity";
import { FilesService } from "src/files/files.service";
import { Repository } from "typeorm";
import { NewNoteDto } from "./new-note.dto";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    private filesService: FilesService,
  ) {}

  async createNote(note: NewNoteDto) {
    let tag = await this.tagRepo.findOne({ where: { name: note.tag.toLowerCase() } });
    console.log("there 1");
    if (!tag) tag = await this.createTag(note.tag);
    console.log("there 2");

    const files: FileEntity[] = [];
    for (const fileId of note.files) {
      const file = await this.filesService.getFileById(fileId);
      files.push(file);
    }

    return this.noteRepo.save({
      tag,
      label: note.label,
      content: note.content,
      files,
      created: new Date(),
      forDay: this.getDateDay(new Date(note.forDay)),
    });
  }

  async createTag(label: string) {
    console.log("there 3");
    const color = this.getRandomColor();
    console.log("there 4");
    return this.tagRepo.save({ name: label.toLowerCase(), color: color.finalColor });
  }

  getDateDay(date: Date) {
    // Strip out the time portion of the date
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  getRandomColor(h?: number) {
    const PHI = 0.618033988749895;
    let s, v, hue;
    if (h === undefined) {
      hue = Math.floor(Math.random() * (360 - 0 + 1) + 0) / 360;
      h = (hue + hue / PHI) % 360;
    } else h /= 360;
    v = Math.floor(Math.random() * (100 - 20 + 1) + 20);
    s = (v - 10) / 100;
    v = v / 100;

    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    var finalColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return {
      h,
      s,
      v,
      r,
      g,
      b,
      finalColor,
    };
  }
}
