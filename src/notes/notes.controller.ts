import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { NewNoteDto } from "./new-note.dto";
import { NotesService } from "./notes.service";

@Controller("notes")
export class NotesController {
  constructor(private noteService: NotesService) {}

  @Post("/")
  async createNote(@Body() note: NewNoteDto) {
    return this.noteService.createNote(note);
  }

  @Get("/:year/:month")
  async getNotesForMonth(@Param("year") year: number, @Param("month") month: number) {
    return this.noteService.getNotesForMonth(year, month);
  }
}
