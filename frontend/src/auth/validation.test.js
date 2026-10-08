import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "./validation.js";

test("register requires email, password, confirmation", () => {
  assert.deepEqual(
    Object.keys(validate({ email: "", password: "", confirm: "" }, "register")),
    ["email", "password", "confirm"],
  );
});
test("register catches malformed email, short password and mismatch", () => {
  const errors = validate(
    { email: "a@", password: "123", confirm: "124" },
    "register",
  );
  assert.equal(Object.keys(errors).length, 3);
});
test("register accepts matching eight-character password and trimmed email", () => {
  assert.deepEqual(
    validate(
      {
        email: " guest@example.com ",
        password: "12345678",
        confirm: "12345678",
      },
      "register",
    ),
    {},
  );
});
test("login does not impose a new registration password policy", () => {
  assert.deepEqual(
    validate(
      { email: "guest@example.com", password: "oldpw", confirm: "" },
      "login",
    ),
    {},
  );
});
test("forgot only validates email", () => {
  assert.deepEqual(
    validate(
      { email: "guest@example.com", password: "", confirm: "" },
      "forgot",
    ),
    {},
  );
  assert.ok(validate({ email: "guest @example.com" }, "forgot").email);
});
test("changing original password invalidates previous confirmation", () => {
  assert.ok(
    validate(
      {
        email: "guest@example.com",
        password: "newpass123",
        confirm: "oldpass123",
      },
      "register",
    ).confirm,
  );
});
