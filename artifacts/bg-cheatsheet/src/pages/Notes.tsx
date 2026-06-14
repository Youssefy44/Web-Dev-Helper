import { useState, useRef, useEffect } from "react";
import { useGetNotes, getGetNotesQueryKey, useCreateNote, useDeleteNote } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, FileText, Loader2, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DeletedNote {
  id: number;
  content: string;
  createdAt: string;
}

export default function Notes() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [deletedNote, setDeletedNote] = useState<DeletedNote | null>(null);
  const [undoProgress, setUndoProgress] = useState(100);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: notes, isLoading } = useGetNotes({
    query: { queryKey: getGetNotesQueryKey() },
  });

  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (undoProgressRef.current) clearInterval(undoProgressRef.current);
    };
  }, []);

  const startUndoTimer = () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (undoProgressRef.current) clearInterval(undoProgressRef.current);

    setUndoProgress(100);
    const DURATION = 5000;
    const TICK = 50;
    const decrement = (TICK / DURATION) * 100;

    undoProgressRef.current = setInterval(() => {
      setUndoProgress((p) => Math.max(0, p - decrement));
    }, TICK);

    undoTimerRef.current = setTimeout(() => {
      setDeletedNote(null);
      setUndoProgress(100);
      if (undoProgressRef.current) clearInterval(undoProgressRef.current);
    }, DURATION);
  };

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

  const handleDelete = (note: { id: number; content: string; createdAt: string }) => {
    setDeletedNote({ id: note.id, content: note.content, createdAt: note.createdAt });
    startUndoTimer();

    deleteNote.mutate(
      { id: note.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() });
        },
      }
    );
  };

  const handleUndo = () => {
    if (!deletedNote) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (undoProgressRef.current) clearInterval(undoProgressRef.current);

    createNote.mutate(
      { data: { content: deletedNote.content } },
      {
        onSuccess: () => {
          setDeletedNote(null);
          setUndoProgress(100);
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

      {/* Undo Banner */}
      {deletedNote && (
        <div className="relative overflow-hidden rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-none"
            style={{ width: `${undoProgress}%` }}
          />
          <div className="flex items-center gap-3 px-4 py-3">
            <Trash2 className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300 flex-1 truncate">
              Note deleted: <span className="font-medium">"{deletedNote.content.slice(0, 60)}{deletedNote.content.length > 60 ? "…" : ""}"</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={createNote.isPending}
              className="gap-1.5 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 shrink-0"
            >
              {createNote.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Undo2 className="w-3 h-3" />
              )}
              Undo
            </Button>
          </div>
        </div>
      )}

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

      {!isLoading && notes && notes.length === 0 && !deletedNote && (
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
                    onClick={() => handleDelete(note)}
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
