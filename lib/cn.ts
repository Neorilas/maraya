/** Merge class names ignoring falsy values. */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(" ")
}
