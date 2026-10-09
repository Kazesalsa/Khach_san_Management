import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  CircleAlert,
  User,
} from "lucide-react";

export default function AuthField({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete,
  disabled,
}) {
  const [visible, setVisible] = useState(false);

  const secret = name === "password" || name === "confirm";
  const isEmail = name === "email";
  const isUsername = name === "username";

  const inputType = secret
    ? visible
      ? "text"
      : "password"
    : isEmail
      ? "email"
      : "text";

  const placeholder = secret
    ? "Nhập mật khẩu của bạn"
    : isEmail
      ? "ban@email.com"
      : isUsername
        ? "Nhập tên đăng nhập"
        : "";

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-text-primary"
      >
        {label}{" "}
        <span className="text-danger-custom" aria-hidden="true">
          *
        </span>
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-4 text-text-secondary">
          {secret ? (
            <LockKeyhole size={18} />
          ) : isEmail ? (
            <Mail size={18} />
          ) : (
            <User size={18} />
          )}
        </span>

        <input
          id={name}
          name={name}
          type={inputType}
          required
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="none"
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${name}-error`
              : hint
                ? `${name}-hint`
                : undefined
          }
          placeholder={placeholder}
          className={`h-[52px] w-full rounded-xl border bg-surface pl-11 ${
            secret ? "pr-14" : "pr-4"
          } text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:ring-4 disabled:bg-surface-alt/60 ${
            error
              ? "border-danger-custom focus:border-danger-custom focus:ring-danger-custom/10"
              : "border-border-custom hover:border-accent focus:border-accent focus:ring-accent/15"
          }`}
        />

        {secret && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setVisible((current) => !current)}
            aria-label={`${visible ? "Ẩn" : "Hiện"} ${label.toLowerCase()}`}
            aria-pressed={visible}
            className="absolute right-1 top-1 grid size-11 place-items-center rounded-lg text-text-secondary transition hover:bg-surface-alt hover:text-primary"
          >
            {visible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        )}
      </div>

      {error ? (
        <p
          id={`${name}-error`}
          className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-danger-custom"
        >
          <CircleAlert size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${name}-hint`}
          className="mt-2 text-xs leading-5 text-text-secondary"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}