import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "./note.entity";

@Entity({ name: "file" })
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  filename: string;

  @ManyToOne(() => Note, (note) => note.files)
  note: Note;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;
}
