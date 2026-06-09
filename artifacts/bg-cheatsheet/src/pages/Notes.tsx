import { useState } from "react";
import { useGetNotes, getGetNotesQueryKey, useCreateNote, useDeleteNote } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Notes() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const { data: notes, isLoading } = useGetNotes({
    query: { queryKey: getGetNotesQueryKey() },
  });

  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const handleCreate = () => {
    if (!draft.trim()) return;
    createNote.mutate(
      { data: { content: draft.trim() } },
      {
        onSuccess: () => {
          setDraft("");
          queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteNote.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl" data-testid="notes-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Notes</h1>
        <p className="text-sm text-muted-foreground mt-1">Personal reference notes — visible only to you during this session</p>
      </div>

      {/* Create Note */}
      <div className="space-y-3">
        <Textarea
          placeholder="Add a quick note... (Ctrl+Enter to save)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="resize-none text-sm"
          data-testid="note-input"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Press Ctrl+Enter to save quickly</p>
          <Button
            onClick={handleCreate}
            disabled={!draft.trim() || createNote.isPending}
            size="sm"
            className="gap-2"
            data-testid="note-save"
          >
            {createNote.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            Save Note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      {isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          <Loader2 className="w-6 h-6 mx-auto animate-spin opacity-40" />
          <p className="text-sm mt-2">Loading notes...</p>
        </div>
      )}

      {!isLoading && notes && notes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No notes yet</p>
          <p className="text-xs mt-1">Add notes for quick reference during calls</p>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
          {[...notes].reverse().map((note) => (
            <Card key={note.id} className="border border-border group hover:border-primary/30 transition-colors" data-testid={`note-${note.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <p className="text-sm text-foreground leading-relaxed flex-1 whitespace-pre-wrap">{note.content}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => handleDelete(note.id)}
                    disabled={deleteNote.isPending}
                    data-testid={`note-delete-${note.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
