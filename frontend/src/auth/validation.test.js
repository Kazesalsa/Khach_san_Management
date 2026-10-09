import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "./validation.js";

test("register requires email, password, confirmation", () => {
  assert.deepEqual(
    Object.keys(
      validate(
        { username: "", email: "", password: "", confirm: "" },
        "register",
      ),
    ),
    ["email", "password", "confirm"],
  );
});

test("register catches malformed email, short password and mismatch", () => {
  const errors = validate(
    {
      username: "",
      email: "a@",
      password: "123",
      confirm: "124",
    },
    "register",
  );

  assert.equal(Object.keys(errors).length, 3);
});

test("register accepts matching eight-character password and trimmed email", () => {
  assert.deepEqual(
    validate(
      {
        username: "",
        email: " guest@example.com ",
        password: "12345678",
        confirm: "12345678",
      },
      "register",
    ),
    {},
  );
});

test("login requires username", () => {
  const errors = validate(
    {
      username: "",
      email: "",
      password: "password",
      confirm: "",
    },
    "login",
  );

  assert.equal(errors.username, "Vui lòng nhập tên đăng nhập.");
});

test("login requires password", () => {
  const errors = validate(
    {
      username: "letan1",
      email: "",
      password: "",
      confirm: "",
    },
    "login",
  );

  assert.equal(errors.password, "Vui lòng nhập mật khẩu.");
});

test("login accepts username and does not impose registration password length", () => {
  assert.deepEqual(
    validate(
      {
        username: "letan1",
        email: "",
        password: "oldpw",
        confirm: "",
      },
      "login",
    ),
    {},
  );
});

test("login trims username when checking whether it is empty", () => {
  const errors = validate(
    {
      username: "   ",
      email: "",
      password: "password",
      confirm: "",
    },
    "login",
  );

  assert.ok(errors.username);
});

test("forgot only validates email", () => {
  assert.deepEqual(
    validate(
      {
        username: "",
        email: "guest@example.com",
        password: "",
        confirm: "",
      },
      "forgot",
    ),
    {},
  );

  assert.ok(
    validate(
      {
        username: "",
        email: "guest @example.com",
        password: "",
        confirm: "",
      },
      "forgot",
    ).email,
  );
});

test("changing original password invalidates previous confirmation", () => {
  assert.ok(
    validate(
      {
        username: "",
        email: "guest@example.com",
        password: "newpass123",
        confirm: "oldpass123",
      },
      "register",
    ).confirm,
  );
});