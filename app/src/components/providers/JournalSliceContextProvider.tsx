import { JournalSliceContext } from '@/model/contexts/JournalSliceContext';
import { CalendarRange, GroupBy, JournalSlice, Refinement, SortBy, SortOrder } from '@/model/schema/aggregate-schemas';
import { useCallback, useMemo, useState } from 'react';

export function JournalSliceContextProvider(props: JournalSliceContextProviderProps) {

  const router = useRouter();

  const [slice, setSlice] = useState<JournalSlice>(props.initialSearch);

  const handleChangeSlice = (slice: Partial<JournalSlice>) => {
    setSlice((prev) => {
      const next = {
        ...prev,
        ...slice,
      }
      router.navigate({
        to: '/journal',
        search: journalSliceToSearchParams(next),
      });
      return next;
    });
  }


  const setGroupBy = useCallback(
    (groupBy: GroupBy) => {
      handleChangeSlice({ groupBy });
    },
    [handleChangeSlice],
  )

  const setSortBy = useCallback(
    (sortBy: SortBy) => {
      handleChangeSlice({ sortBy });
    },
    [handleChangeSlice],
  )

  const setSortOrder = useCallback(
    (sortOrder: SortOrder) => {
      handleChangeSlice({ sortOrder });
    },
    [handleChangeSlice],
  )

  const setCalendar = useCallback(
    (calendar: CalendarRange) => {
      handleChangeSlice({ calendar });
    },
    [handleChangeSlice],
  )

  const setRefinements = useCallback(
    (refinements: Refinement) => {
      handleChangeSlice({ refinements });
    },
    [handleChangeSlice],
  )


  const value = useMemo(() => ({
    slice,
    setGroupBy,
    setSortBy,
    setSortOrder,
    setCalendar,
    setRefinements,
  }), [slice, setGroupBy, setSortBy, setSortOrder, setCalendar, setRefinements]);

  return (
    <JournalSliceContext.Provider value={value}>
      {props.children}
    </JournalSliceContext.Provider>
  )
}
