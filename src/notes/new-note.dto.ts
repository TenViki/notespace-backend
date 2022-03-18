import { Type } from "class-transformer";
import { IsArray, IsString, MinLength } from "class-validator";

export class NewNoteDto {
  @IsString()
  @MinLength(3)
  tag: string;

  @IsArray()
  @Type(() => String)
  files: string[];

  @IsString()
  @MinLength(3)
  label: string;

  @IsString()
  content: string;

  @IsString()
  forDay: string;
}
