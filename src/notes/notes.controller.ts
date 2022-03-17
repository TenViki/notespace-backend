import { Body, Controller, Post } from "@nestjs/common";
import { NewNoteDto } from "./new-note.dto";

@Controller("notes")
export class NotesController {
  @Post("/")
  async createNote(@Body() note: NewNoteDto) {}
}
