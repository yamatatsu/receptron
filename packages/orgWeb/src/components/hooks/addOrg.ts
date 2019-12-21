import { useState, useCallback, useEffect } from "react";
import { Subject, Observable } from "rxjs";
import { useEventCallback } from "rxjs-hooks";

type Org = { name: string };
type State = { submitting: false };

export default function useAddOrg() {
  const [addOrg, { submitting }] = useEventCallback<Org, State>(
    (event$, state$) => state$,
    { submitting: false },
  );
  return { addOrg, submitting };
}
