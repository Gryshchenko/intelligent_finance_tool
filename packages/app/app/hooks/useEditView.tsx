import { useState } from "react"

export function useEditView<T extends object>(initialData: T) {
  const [form, setForm] = useState<Partial<T>>(initialData)

  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setForm((prev) => ({ ...(prev ?? {}), [key]: value }))
  }

  const save = (cb?: (data: Partial<T>) => Promise<void> | void) => {
    cb?.(form)
  }

  return {
    form,
    handleChange,
    save,
  }
}
