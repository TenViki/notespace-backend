import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class NewNoteDto {
  @IsString()
  tag: string;

  @IsArray()
  @Type(() => String)
  files: string[];

  @IsString()
  label: string;

  @IsString()
  content: string;

  @IsString()
  forDay: string;
}
