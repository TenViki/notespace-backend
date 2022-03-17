import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./entities/file.entity";
import { Note } from "./entities/note.entity";
import { Tag } from "./entities/tag.entity";
import { FilesModule } from "./files/files.module";
import { NotesModule } from "./notes/notes.module";
import { ValidationPipeCheck } from "./validation/validation.pipe";
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [FileEntity, Tag, Note],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    FilesModule,
    NotesModule,
    TagsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipeCheck({ whitelist: true, stopAtFirstError: true }),
    },
  ],
})
export class AppModule {}
