/**
 * Composable hook for "did you mean" suggestions using didyoumean2
 * @param name - The name to search for
 * @param keyPrefix - Prefix for the useAsyncData cache key
 * @param itemExists - Whether the item exists (if true, returns null)
 * @param possibleNames - Array of possible names to search through
 */
export function useDidYouMean(
  name: string,
  keyPrefix: string,
  itemExists: boolean | Ref<boolean> | ComputedRef<boolean>,
  possibleNames: string[] | Ref<string[]> | ComputedRef<string[]>
) {
  const { data: didYouMeanThing } = useAsyncData(`didYouMean-${keyPrefix}-${name}`, async () => {
    const exists = unref(itemExists);
    if (exists) {
      return null;
    }
    const didYouMean = await import('didyoumean2').then((m) => m.default);
    const names = unref(possibleNames);
    const similar = didYouMean(name, names);
    return similar;
  });

  return didYouMeanThing;
}
