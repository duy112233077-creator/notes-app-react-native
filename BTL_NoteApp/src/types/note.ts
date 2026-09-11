export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export type CreateNoteInput = {
  title: string;
  content: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
};
