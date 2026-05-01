import { cn } from "@/lib/cn"

type FieldShellProps = {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

/** Wrapper común con label/hint/error. Reutilizado por Input/Textarea/Toggle/Select. */
export function FieldShell({
  label,
  hint,
  error,
  required,
  children,
}: FieldShellProps) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-mid mb-1.5">
        {label}
        {required && <span className="text-pink-deep" aria-hidden>*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="block mt-1 text-xs text-text-mid italic">{hint}</span>
      )}
      {error && (
        <span className="block mt-1 text-xs text-red-600 font-semibold">
          {error}
        </span>
      )}
    </label>
  )
}

const INPUT_BASE =
  "w-full px-4 py-2.5 rounded-xl bg-white border-2 border-pink-light text-sm text-text-dark outline-none transition focus:border-pink-primary placeholder:text-text-mid/50"

type CommonProps = {
  label: string
  hint?: string
  error?: string
}

export function Input({
  label,
  hint,
  error,
  className,
  ...rest
}: CommonProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={rest.required}>
      <input
        {...rest}
        className={cn(INPUT_BASE, error && "border-red-300", className)}
      />
    </FieldShell>
  )
}

export function Textarea({
  label,
  hint,
  error,
  className,
  ...rest
}: CommonProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={rest.required}>
      <textarea
        rows={3}
        {...rest}
        className={cn(INPUT_BASE, "resize-y", error && "border-red-300", className)}
      />
    </FieldShell>
  )
}

export function Select({
  label,
  hint,
  error,
  options,
  className,
  ...rest
}: CommonProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ value: string; label: string }>
  }) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={rest.required}>
      <select
        {...rest}
        className={cn(INPUT_BASE, "bg-white", error && "border-red-300", className)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function Toggle({
  label,
  hint,
  defaultChecked,
  name,
  ...rest
}: {
  label: string
  hint?: string
  name: string
  defaultChecked?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name">) {
  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer">
      {/* Marca al server "este toggle es parte del form" — útil para
          updates parciales: si el checkbox no llega, el server sabe
          que era false (vs no incluido en absoluto). */}
      <input type="hidden" name={`__has_${name}`} value="1" />
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
        {...rest}
      />
      <span className="relative w-11 h-6 rounded-full bg-pink-light peer-checked:bg-pink-primary transition shrink-0 mt-0.5">
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-text-dark">
          {label}
        </span>
        {hint && (
          <span className="block text-xs text-text-mid italic mt-0.5">
            {hint}
          </span>
        )}
      </span>
    </label>
  )
}
