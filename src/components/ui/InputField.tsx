import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface InputFieldProps<T extends FieldValues> {
  control?: Control<T>
  register?: UseFormRegister<T>
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
  errors?: FieldErrors<T>
}

export function InputField<T extends FieldValues>({
  control,
  register,
  name,
  label,
  type = "text",
  placeholder,
  errors,
}: InputFieldProps<T>) {
  const errorMessage = errors?.[name]?.message as string | undefined

  /* ----------- Controller Mode ----------- */
  if (control) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>{label}</Label>

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <motion.div whileFocus={{ scale: 1.01 }}>
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                aria-invalid={!!errorMessage}
              />
            </motion.div>
          )}
        />

        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }

  /* ----------- Register Mode ----------- */
  if (register) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>{label}</Label>

        <motion.div whileFocus={{ scale: 1.01 }}>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!errorMessage}
            {...register(name)}
          />
        </motion.div>

        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }

  /* ----------- Fallback ----------- */
  return (
    <div className="text-red-500 text-sm">
      ⚠ InputField: cần truyền control hoặc register
    </div>
  )
}
