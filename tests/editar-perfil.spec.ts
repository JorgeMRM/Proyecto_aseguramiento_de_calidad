import { test, expect } from "@playwright/test";

test.setTimeout(60000);

test("Editar perfil de usuario en Buggy Cars", async ({ page }) => {
  // 1️⃣ Ir al sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1280, height: 800 });

  // 2️⃣ Login
  await page.fill('input[name="login"]', "Tu usuario");
  await page.fill('input[name="password"]', "Tu contraseña");
  await page.click('button:has-text("Login")');

  // 3️⃣ Ir a Profile
  await page.waitForSelector('a:has-text("Profile")');
  await page.click('a:has-text("Profile")');

  // 4️⃣ Esperar formulario
  await page.waitForSelector('input[name="firstName"]');

  // 5️⃣ Editar datos
  await page.fill('input[name="firstName"]', "Carlos");
  await page.fill('input[name="lastName"]', "contreras");

  // 6️⃣ Guardar
  await page.click('button:has-text("Save")');

  // 7️⃣ Verificar mensaje (más flexible)
  const mensaje = page.locator(".result:not(.hidden-md-down)");
  await expect(mensaje).toHaveText(/The profile has been saved/);
});
