import { useState, useCallback, useEffect } from "react";
import { Subject, Observable } from "rxjs";

export function useToggle(defaultValue: boolean): [boolean, () => void] {
  const [val, set] = useState(defaultValue);
  return [val, () => set(!val)];
}

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const [val, setVal] = useState(initial);
  useEffect(() => {
    const subscription = observable$.subscribe({
      next: v => setVal(v),
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [observable$]);

  return val;
}
export function useSubject<T>(subject$: Subject<T>): (val: T) => void {
  return useCallback((val: T) => subject$.next(val), [subject$]);
}
