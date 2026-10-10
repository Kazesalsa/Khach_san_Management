import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Check,
  LoaderCircle,
  Info,
} from "lucide-react";
import AuthHeader from "./AuthHeader";
import AuthField from "./AuthField";
import { validate } from "./validation";
import {
  login,
  getCurrentProfile,
} from "../services/authService";

const copy = {
  login: {
    eyebrow: "CHÀO MỪNG TRỞ LẠI",
    title: "Một chạm, gần hơn\nvới kỳ nghỉ của bạn.",
    heading: "Đăng nhập",
    detail: "Đăng nhập để tiếp tục hành trình cùng Sương Mai.",
    submit: "Đăng nhập",
    other: "Bạn chưa có tài khoản?",
    link: "Đăng ký ngay",
    to: "/dang-ky",
  },
  register: {
    eyebrow: "BẮT ĐẦU HÀNH TRÌNH",
    title: "Những kỳ nghỉ đẹp\nbắt đầu từ đây.",
    heading: "Tạo tài khoản",
    detail: "Gia nhập Sương Mai và lưu giữ những trải nghiệm của bạn.",
    submit: "Đăng ký",
    other: "Bạn đã có tài khoản?",
    link: "Đăng nhập",
    to: "/dang-nhap",
  },
  forgot: {
    eyebrow: "LUÔN ĐỒNG HÀNH CÙNG BẠN",
    title: "Kết nối lại với\nnhững điều thân quen.",
    heading: "Quên mật khẩu?",
    detail: "Nhập email tài khoản để bắt đầu khôi phục mật khẩu.",
    submit: "Tiếp tục",
    other: "Nhớ mật khẩu rồi?",
    link: "Về đăng nhập",
    to: "/dang-nhap",
  },
};

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const c = copy[mode];
  const reduce = useReducedMotion();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState({});
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const form = useRef(null);
  const status = useRef(null);
  const submitting = useRef(false);
  const errors = validate(values, mode);

  useEffect(() => {
    document.title = `${copy[mode].heading} | Sương Mai Hotel`;
  }, [mode]);

  const notify = (message, type = "info") => {
    setNotice(message);
    setNoticeType(type);
    requestAnimationFrame(() => status.current?.focus());
  };

  const change = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setNotice("");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (submitting.current) return;

    setTouched({
      username: true,
      email: true,
      password: true,
      confirm: true,
    });

    const first = Object.keys(errors)[0];

    if (first) {
      form.current.elements.namedItem(first)?.focus();
      return;
    }

    submitting.current = true;
    setBusy(true);
    setNotice("");

    try {
      // Issue #40 hiện tại chỉ kết nối API thật cho màn Login.
      if (mode === "login") {
        const loginResult = await login(
          values.username.trim(),
          values.password,
        );

        const token = loginResult.token;

        if (!token) {
          throw new Error("Backend không trả về JWT token.");
        }

        // Ghi nhớ đăng nhập:
        // checked   -> tồn tại cả khi đóng browser
        // unchecked -> chỉ tồn tại trong tab/session hiện tại
        const storage = remember ? localStorage : sessionStorage;
        const otherStorage = remember ? sessionStorage : localStorage;

        storage.setItem("authToken", token);
        otherStorage.removeItem("authToken");

        const profile = await getCurrentProfile(token);

        storage.setItem("authUser", JSON.stringify(profile));
        otherStorage.removeItem("authUser");

        navigate("/", { replace: true }); 

        setValues((v) => ({
          ...v,
          password: "",
        }));

        setTouched({});
        return;
      }

      // Register và Forgot hiện chưa có API tương ứng,
      // nên tạm giữ hành vi demo cũ.
      if (mode === "forgot") {
        notify(
          "Bản demo: email hợp lệ. Chưa gửi email khôi phục mật khẩu.",
        );
      } else if (mode === "register") {
        notify(
          "Bản demo: thông tin đăng ký hợp lệ. Chưa tạo tài khoản thật.",
        );
      }
    } catch (error) {
      // Nếu login thất bại thì không giữ token/user cũ.
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("authUser");

      const status = error.response?.status;

      if (status === 401) {
        notify("Tên đăng nhập hoặc mật khẩu không đúng.", "error");
      } else if (status === 403) {
        notify("Tài khoản đã bị khóa hoặc không có quyền đăng nhập.", "error");
      } else if (!error.response) {
        notify(
          "Không thể kết nối đến máy chủ. Hãy kiểm tra backend đang chạy.",
          "error"
        );
      } else {
        notify("Đăng nhập thất bại. Vui lòng thử lại.", "error");
      }
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  };

  const field = (name, label, autoComplete, hint) => (
    <AuthField
      key={name}
      name={name}
      label={label}
      autoComplete={autoComplete}
      hint={hint}
      value={values[name]}
      disabled={busy}
      onChange={change}
      onBlur={() => setTouched((t) => ({ ...t, [name]: true }))}
      error={touched[name] ? errors[name] : undefined}
    />
  );

  return (
    <div className="auth-shell flex min-h-screen flex-col">
      <a
        href="#auth-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:p-4"
      >
        Đến nội dung chính
      </a>

      <AuthHeader />

      <main
        id="auth-main"
        className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-start px-4 py-7 sm:px-8 sm:py-10 lg:justify-center lg:py-12"
      >
        <div className="mb-5 flex items-center justify-between gap-3 text-xs text-text-secondary">
          <span>
            Tài khoản
            <span className="mx-2 text-border-custom">/</span>
            <span className="font-semibold text-primary">{c.heading}</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <ShieldCheck size={14} className="text-accent" />
            Không gian dành riêng cho bạn
          </span>
        </div>

        <div className="grid rounded-2xl border border-border-custom bg-surface shadow-[0_20px_60px_-28px_rgba(19,42,58,.28)] lg:grid-cols-[.95fr_1.05fr]">
          <aside className="auth-visual relative hidden min-h-[680px] flex-col justify-between overflow-hidden p-10 text-text-on-dark lg:flex">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-primary-dark/40 px-3 py-2 text-[10px] font-semibold tracking-[.14em] text-background backdrop-blur-sm">
                <Sparkles size={13} className="text-accent" />
                SƯƠNG MAI EXPERIENCE
              </span>

              <h2 className="mt-9 whitespace-pre-line font-headline text-[42px] font-semibold leading-[1.22] text-background">
                {c.title}
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-7 text-background/80">
                Một không gian an yên, một trải nghiệm tinh tế. Sương Mai chào
                đón bạn trở về.
              </p>
            </div>

            <div className="relative z-10 rounded-2xl border border-white/20 bg-primary-dark/45 p-6 backdrop-blur-md">
              <p className="mb-4 text-[10px] font-semibold tracking-[.18em] text-accent">
                KỲ NGHỈ CỦA BẠN, THẬT DỄ DÀNG
              </p>
              {[
                "Theo dõi thông tin đặt phòng",
                "Lưu những lựa chọn yêu thích",
                "Khám phá ưu đãi dành cho bạn",
              ].map((text) => (
                <p key={text} className="mt-3 flex items-center gap-3 text-sm text-background/90">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-primary">
                    <Check size={14} />
                  </span>
                  {text}
                </p>
              ))}
            </div>
          </aside>

          <motion.section
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-center bg-surface px-5 py-8 sm:px-12 sm:py-11 lg:px-14"
          >
            <p className="mb-3 text-[10px] font-bold tracking-[.2em] text-accent">
              {c.eyebrow}
            </p>

            <h1 className="font-headline text-3xl font-semibold text-primary sm:text-4xl">
              {c.heading}
            </h1>

            <p className="mb-7 mt-3 text-sm leading-6 text-text-secondary">
              {c.detail}
            </p>

            {mode !== "forgot" && (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    notify(
                      "Đăng nhập Google chưa được kết nối trong bản giao diện này.",
                    )
                  }
                  className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-border-custom bg-surface px-4 text-sm font-semibold text-text-primary transition hover:border-accent hover:bg-surface-alt disabled:opacity-60"
                >
                  <GoogleIcon />
                  {mode === "register" ? "Đăng ký" : "Đăng nhập"} bằng Google
                </button>

                <div className="my-6 flex items-center gap-4 text-[11px] text-text-secondary/70">
                  <span className="h-px flex-1 bg-border-custom" />
                  {mode === "login"
                    ? "hoặc tiếp tục với tên đăng nhập"
                    : "hoặc tiếp tục với email"}
                  <span className="h-px flex-1 bg-border-custom" />
                </div>
              </>
            )}

            <form
              ref={form}
              noValidate
              onSubmit={submit}
              aria-busy={busy}
              className="space-y-5"
            >
              {mode === "login"
              ? field("username", "Tên đăng nhập", "username")
              : field("email", "Email", "email")}

              {mode !== "forgot" &&
                field(
                  "password",
                  "Mật khẩu",
                  mode === "login" ? "current-password" : "new-password",
                  mode === "register" ? "Sử dụng ít nhất 8 ký tự." : null,
                )}

              {mode === "register" &&
                field("confirm", "Xác nhận mật khẩu", "new-password")}

              {mode === "login" && (
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-text-secondary">
                  <label className="flex min-h-11 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={remember}
                      disabled={busy}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="size-4 accent-accent"
                    />
                    Ghi nhớ đăng nhập
                  </label>

                  <Link
                    className="inline-flex min-h-11 items-center font-semibold text-primary transition-colors hover:text-accent"
                    to="/quen-mat-khau"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={busy}
                whileTap={reduce ? undefined : { scale: 0.99 }}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-primary shadow-[0_10px_24px_-14px_rgba(198,161,91,.8)] transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-65"
              >
                {busy ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin motion-reduce:animate-none"
                    />
                    Đang kiểm tra…
                  </>
                ) : (
                  <>
                    {c.submit}
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>
            </form>

            <div
              ref={status}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className={
                notice
                  ? noticeType === "error"
                    ? "mt-5 rounded-xl border border-danger-custom/30 bg-danger-custom/10 p-4 text-xs leading-6 text-danger-custom"
                    : "mt-5 rounded-xl border border-success-custom/30 bg-success-custom/10 p-4 text-xs leading-6 text-success-custom"
                  : "sr-only"
              }
            >
              {notice && (
                <span className="flex items-start gap-2">
                  <Info size={17} className="mt-1 shrink-0" />
                  {notice}
                </span>
              )}
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-text-secondary">
              {c.other}{" "}
              <Link
                to={c.to}
                className="inline-flex min-h-11 items-center font-bold text-primary transition-colors hover:text-accent"
              >
                {c.link}
              </Link>
            </p>

            {mode === "forgot" && (
              <Link
                to="/dang-nhap"
                className="mt-2 flex min-h-11 items-center justify-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-accent"
              >
                <ArrowLeft size={15} /> Quay lại
              </Link>
            )}

            <p className="mt-3 text-center text-[10px] leading-5 text-text-secondary/70">
              {mode === "login"
                ? "Đăng nhập đã kết nối hệ thống tài khoản"
                : "Bản xem thử giao diện · Chưa kết nối dịch vụ tài khoản"}
            </p>
          </motion.section>
        </div>
      </main>

      <footer className="mx-auto flex w-full max-w-[1240px] flex-wrap justify-between gap-3 px-5 pb-6 text-[10px] leading-5 text-text-secondary sm:px-8">
        <span>© {new Date().getFullYear()} Sương Mai Hotel</span>
        <span>
          Indochine Elegance & Hospitality
          <span className="mx-2 text-accent">•</span>
          Một kỳ nghỉ, vạn an yên.
        </span>
      </footer>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.6l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.5H5.8v5.2A20.4 20.4 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18l6.8-5.2Z"
      />
      <path
        fill="#EA4335"
        d="M24 11.7c3 0 5.6 1 7.7 3l5.8-5.7A19.4 19.4 0 0 0 24 4 20.4 20.4 0 0 0 5.8 15l6.8 5.2c1.6-4.9 6.1-8.5 11.4-8.5Z"
      />
    </svg>
  );
}
