import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FileEntity } from "./file.entity";
import { Tag } from "./tag.entity";

@Entity()
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Tag)
  tag: Tag;

  @Column()
  label: string;

  @Column()
  content: string;

  @OneToMany(() => FileEntity, (file) => file.note)
  files: FileEntity[];

  @Column({ type: "date", default: () => "CURRENT_DATE" })
  created: Date;

  @Column({ type: "date" })
  forDay: Date;
}
