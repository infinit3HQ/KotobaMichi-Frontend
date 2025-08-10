// src/routes/dashboard/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/organisms/protected-route'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/atoms/dialog'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Checkbox } from '@/components/atoms/checkbox'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getApiError } from '@/lib/api'
import type { WordsListResponse, Word, QuizSummary, QuizDetail, CreateQuizPayload } from '@/types/api'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage vocabulary and public quizzes.</p>
        <Tabs defaultValue="words" className="w-full">
          <TabsList>
            <TabsTrigger value="words">Vocabulary</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="words" className="space-y-4">
            <WordsManager />
          </TabsContent>
          <TabsContent value="quizzes" className="space-y-4">
            <QuizzesManager />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

function WordsManager() {
  const [page, setPage] = useState(1)
  const limit = 20
  const qc = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'words', { page, limit }],
    queryFn: async () => (await api.get<WordsListResponse>('/words', { params: { page, limit } })).data,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Word, 'id'>) => (await api.post<Word>('/words', payload)).data,
    onSuccess: () => {
      toast.success('Word added')
      qc.invalidateQueries({ queryKey: ['admin', 'words'] })
    },
    onError: (e) => toast.error(getApiError(e).message ?? 'Failed to add'),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Word> }) => (await api.patch<Word>(`/words/${id}`, data)).data,
    onSuccess: () => {
      toast.success('Word updated')
      qc.invalidateQueries({ queryKey: ['admin', 'words'] })
    },
    onError: (e) => toast.error(getApiError(e).message ?? 'Failed to update'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/words/${id}`)).data,
    onSuccess: () => {
      toast.success('Word deleted')
      qc.invalidateQueries({ queryKey: ['admin', 'words'] })
    },
    onError: (e) => toast.error(getApiError(e).message ?? 'Failed to delete'),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Words</CardTitle>
        <CreateWordDialog onSubmit={(w) => createMutation.mutate(w)} submitting={createMutation.isPending} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="text-destructive">Failed to load words.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Kana/Kanji</th>
                  <th className="p-2">Meaning</th>
                  <th className="p-2">Pronunciation</th>
                  <th className="p-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.words.map((w) => (
                  <tr key={w.id} className="border-b">
                    <td className="p-2">
                      <div className="font-medium">{w.hiragana || w.katakana || w.kanji}</div>
                      <div className="text-xs text-muted-foreground">{w.kanji}</div>
                    </td>
                    <td className="p-2">{w.meaning}</td>
                    <td className="p-2 truncate max-w-[12rem]">{w.pronunciation}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <EditWordDialog word={w} onSubmit={(data) => updateMutation.mutate({ id: w.id, data })} submitting={updateMutation.isPending} />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this word?')) deleteMutation.mutate(w.id)
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between pt-3 text-sm">
              <span className="text-muted-foreground">
                Page {data?.pagination.page} of {data?.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={data?.pagination.page === data?.pagination.totalPages}>Next</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CreateWordDialog({ onSubmit, submitting }: { onSubmit: (w: Omit<Word, 'id'>) => void; submitting?: boolean }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Omit<Word, 'id'>>({ hiragana: '', katakana: '', kanji: '', pronunciation: '', meaning: '' })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add word</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Word</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <LabeledInput label="Hiragana" value={form.hiragana} onChange={(v) => setForm({ ...form, hiragana: v })} />
          <LabeledInput label="Katakana" value={form.katakana} onChange={(v) => setForm({ ...form, katakana: v })} />
          <LabeledInput label="Kanji" value={form.kanji ?? ''} onChange={(v) => setForm({ ...form, kanji: v })} />
          <LabeledInput label="Pronunciation URL" value={form.pronunciation} onChange={(v) => setForm({ ...form, pronunciation: v })} />
          <LabeledInput label="Meaning" value={form.meaning} onChange={(v) => setForm({ ...form, meaning: v })} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { onSubmit(form); setOpen(false) }} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditWordDialog({ word, onSubmit, submitting }: { word: Word; onSubmit: (w: Partial<Word>) => void; submitting?: boolean }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Word>>({ ...word })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Word</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <LabeledInput label="Hiragana" value={form.hiragana ?? ''} onChange={(v) => setForm({ ...form, hiragana: v })} />
          <LabeledInput label="Katakana" value={form.katakana ?? ''} onChange={(v) => setForm({ ...form, katakana: v })} />
          <LabeledInput label="Kanji" value={form.kanji ?? ''} onChange={(v) => setForm({ ...form, kanji: v })} />
          <LabeledInput label="Pronunciation URL" value={form.pronunciation ?? ''} onChange={(v) => setForm({ ...form, pronunciation: v })} />
          <LabeledInput label="Meaning" value={form.meaning ?? ''} onChange={(v) => setForm({ ...form, meaning: v })} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { onSubmit(form); setOpen(false) }} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function QuizzesManager() {
  const qc = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'quizzes'],
    queryFn: async () => (await api.get<QuizSummary[]>('/quizzes')).data,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/quizzes/${id}`)).data,
    onSuccess: () => {
      toast.success('Quiz deleted')
      qc.invalidateQueries({ queryKey: ['admin', 'quizzes'] })
    },
    onError: (e) => toast.error(getApiError(e).message ?? 'Failed to delete'),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Public Quizzes</CardTitle>
        <CreateQuizDialog onCreated={() => qc.invalidateQueries({ queryKey: ['admin', 'quizzes'] })} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="text-destructive">Failed to load quizzes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Words</th>
                  <th className="p-2">Attempts</th>
                  <th className="p-2">Creator</th>
                  <th className="p-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((q) => (
                  <tr key={q.id} className="border-b">
                    <td className="p-2">
                      <div className="font-medium">{q.title}</div>
                      {q.description && <div className="text-xs text-muted-foreground">{q.description}</div>}
                    </td>
                    <td className="p-2">{q._count.quizWords ?? 0}</td>
                    <td className="p-2">{q._count.attempts ?? 0}</td>
                    <td className="p-2">{q.creator?.email}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        {/* Edit quiz not implemented - API lacks endpoint */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this quiz?')) deleteMutation.mutate(q.id)
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CreateQuizDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const { data: wordsData } = useQuery({
    queryKey: ['admin', 'words', { page: 1, limit: 200 }],
    queryFn: async () => (await api.get<WordsListResponse>('/words', { params: { page: 1, limit: 200 } })).data,
  })

  const mutation = useMutation({
    mutationFn: async (payload: CreateQuizPayload) => (await api.post<QuizDetail>('/quizzes', payload)).data,
    onSuccess: () => {
      toast.success('Quiz created')
      onCreated()
      setOpen(false)
      setTitle('')
      setDescription('')
      setSelected({})
    },
    onError: (e) => toast.error(getApiError(e).message ?? 'Failed to create quiz'),
  })

  const wordIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected])
  const canSubmit = title.trim().length > 0 && wordIds.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create quiz</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Public Quiz</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <LabeledInput label="Title" value={title} onChange={setTitle} />
          <LabeledInput label="Description" value={description} onChange={setDescription} />
          <div>
            <Label>Select words</Label>
            <div className="mt-2 max-h-60 overflow-auto rounded-md border p-2 grid sm:grid-cols-2 gap-2">
              {wordsData?.words.map((w) => (
                <label key={w.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={!!selected[w.id]} onCheckedChange={() => setSelected((s) => ({ ...s, [w.id]: !s[w.id] }))} />
                  <span>{w.hiragana || w.katakana || w.kanji} — {w.meaning}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => mutation.mutate({ title, description, isPublic: true, wordIds })} disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LabeledInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} />
    </div>
  )
}
