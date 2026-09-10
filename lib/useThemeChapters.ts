import { useLang, themesStrings } from '@/contexts/Language'
import type { ThemesChapterData } from '@/components/ThemesChapter'
import weddingContent from '@/content/wedding-content.json'

/**
 * Merges the factual/structural chapter data (content/wedding-content.json —
 * dates, palette names, art filenames) with the reviewed/translated copy
 * (contexts/Language.tsx themesStrings) for the current locale. Shared by
 * /themes and the homepage's bride-side wardrobe teaser so both read from
 * one source of truth.
 */
export function useThemeChapters(): ThemesChapterData[] {
  const { lang } = useLang()
  const tt = themesStrings[lang]

  return weddingContent.chapters.map((c) => {
    const tc = (tt.chapters as Record<string, Record<string, unknown>>)[c.id]
    return {
      id: c.id,
      number: c.number,
      date: c.date,
      timeOfDay: c.timeOfDay,
      art: c.art.split('/').pop()!.replace(/\.png$/, '.jpg'),
      palette: c.palette,
      dressCode: (tc?.dressCode as string | undefined)
        ?? ('dressCode' in c ? (c as { dressCode?: string }).dressCode : undefined),
      fabricNote: (tc?.fabricNote as string | undefined)
        ?? ('fabricNote' in c ? (c as { fabricNote?: string }).fabricNote : undefined),
      outfitExamples: (tc?.outfitExamples as string[] | undefined)
        ?? ('outfitExamples' in c ? (c as { outfitExamples?: string[] }).outfitExamples : undefined),
      event: (tc?.event as string) ?? c.event,
      story: (tc?.story as string) ?? c.story,
      shortLine: (tc?.shortLine as string) ?? c.shortLine,
      men: tc?.men as string | undefined,
      womenSourceVerbatim: tc?.womenSourceVerbatim as string | undefined,
      note: tc?.note as string | undefined,
    }
  })
}
