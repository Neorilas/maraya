/**
 * Convierte un texto en slug URL-friendly.
 *  - lowercase, sin acentos, sin espacios (→ guiones), sin caracteres especiales
 *  - colapsa guiones repetidos, máximo 80 chars
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacríticos combinables
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}
