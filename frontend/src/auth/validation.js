export function validate(values, mode) {
  const errors = {};

  if (mode === "login") {
    if (!values.username?.trim()) {
      errors.username = "Vui lòng nhập tên đăng nhập.";
    }
  } else {
    if (!values.email?.trim()) {
      errors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Email chưa đúng định dạng. Ví dụ: ban@email.com";
    }
  }

  if (mode !== "forgot") {
    if (!values.password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    } else if (mode === "register" && values.password.length < 8) {
      errors.password = "Mật khẩu cần có ít nhất 8 ký tự.";
    }
  }

  if (mode === "register") {
    if (!values.confirm) {
      errors.confirm = "Vui lòng xác nhận mật khẩu.";
    } else if (values.confirm !== values.password) {
      errors.confirm = "Mật khẩu xác nhận chưa khớp.";
    }
  }

  return errors;
}