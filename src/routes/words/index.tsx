// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "@/lib/api";
import type { WordsListResponse, Word } from "@/types/api";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, Search } from "lucide-react";

export const Route = createFileRoute("/words/")({
  component: Home,
});

function Home() {
  const [search, setSearch] = useState("");
  const limit = 1000;

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["words", { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<WordsListResponse>("/words", {
        params: { page: pageParam, limit },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const words = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.words),
    [data?.pages]
  );
  const filtered = useMemo(() => filterWords(words, search), [words, search]);

  // Load more when approaching the end
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="h-[calc(100vh-16rem)]">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
        {/* Search Section */}
        <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by meaning, kana, or kanji..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="px-3 py-1">
                  {filtered.length} results
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Virtualized Cards Grid */}
        <VirtualizedGrid
          items={filtered}
          onLoadMore={loadMore}
          isLoading={isFetchingNextPage}
        />
      </div>
    </div>
  );
}

function filterWords(words: Word[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return words;
  return words.filter((w) =>
    [w.meaning, w.hiragana, w.katakana, w.kanji ?? ""].some((v) =>
      v?.toLowerCase().includes(s)
    )
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-400px)]">
      <div className="text-center space-y-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-lg text-muted-foreground">Loading vocabulary...</p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="h-[calc(100vh-400px)] flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-destructive text-4xl">😞</div>
          <h2 className="text-xl font-semibold">Failed to load words</h2>
          <p className="text-muted-foreground">
            There was an error loading the vocabulary. Please try refreshing the
            page.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Flashcard({ word }: { word: Word }) {
  const [flipped, setFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!word.pronunciation || isPlaying) return;

      setIsPlaying(true);
      try {
        const audio = new Audio(word.pronunciation);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    },
    [word.pronunciation, isPlaying]
  );

  return (
    <div
      className="group perspective cursor-pointer h-48"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative h-full w-full transition-all duration-700 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="h-full border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="h-full flex flex-col justify-center items-center p-6 space-y-3">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {word.hiragana || word.katakana || word.kanji}
                </div>
                {word.kanji && word.hiragana && (
                  <div className="text-xl text-slate-600 dark:text-slate-300">
                    {word.kanji}
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="text-xs opacity-70">
                Click to reveal meaning
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden">
          <Card className="h-full border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="h-full flex flex-col justify-center items-center p-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="text-xl font-semibold text-green-800 dark:text-green-200">
                  {word.meaning}
                </div>
                <div className="text-lg text-slate-700 dark:text-slate-300">
                  {word.hiragana || word.katakana || word.kanji}
                </div>
                {word.kanji && word.hiragana && (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {word.kanji}
                  </div>
                )}
              </div>
              {word.pronunciation && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-white/50 hover:bg-white/80 border-green-300"
                  onClick={playAudio}
                  disabled={isPlaying}
                  aria-label="Play pronunciation"
                >
                  <Volume2
                    className={`h-4 w-4 mr-2 ${
                      isPlaying ? "animate-pulse" : ""
                    }`}
                  />
                  {isPlaying ? "Playing..." : "Listen"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Optimized virtualized grid using @tanstack/react-virtual
function VirtualizedGrid({
  items,
  onLoadMore,
  isLoading,
}: {
  items: Word[];
  onLoadMore: () => void;
  isLoading?: boolean;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);

  // Responsive columns calculation
  const getColumns = useCallback((width: number) => {
    if (width < 640) return 1; // sm
    if (width < 768) return 2; // md
    if (width < 1024) return 3; // lg
    if (width < 1280) return 4; // xl
    return 5; // 2xl+
  }, []);

  const columns = getColumns(parentWidth);
  const itemHeight = 200; // Height of each card including gap
  const gap = 16;

  // Calculate total rows needed
  const totalRows = Math.ceil(items.length / columns);

  // Create virtual rows
  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    paddingStart: gap,
    paddingEnd: gap,
    gap: gap,
  });

  // Handle resize
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const updateWidth = () => setParentWidth(parent.clientWidth);
    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(parent);
    return () => resizeObserver.disconnect();
  }, []);

  // Load more when near end
  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (lastItem && lastItem.index >= totalRows - 2) {
      onLoadMore();
    }
  }, [virtualItems, totalRows, onLoadMore]);

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold">No words found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or clear the search to see all
            words.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={parentRef}
        className="h-[calc(100vh-400px)] overflow-auto rounded-lg"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowStartIndex = virtualRow.index * columns;
            const rowItems = items.slice(
              rowStartIndex,
              rowStartIndex + columns
            );

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className="grid gap-4 h-full px-4"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    paddingBottom: gap,
                  }}
                >
                  {rowItems.map((word, colIndex) => (
                    <Flashcard
                      key={`${word.id}-${virtualRow.index}-${colIndex}`}
                      word={word}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <Card className="p-6 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="text-muted-foreground">Loading more words...</span>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {items.length} words with smooth virtualization
      </div>
    </div>
  );
}
