import { test, expect } from "@playwright/test";

test("Validar mensaje de error cuando el comentario excede el límite permitido", async ({ page }) => {
  // 1️⃣ Ingresar al sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  // 2️⃣ Iniciar sesión
  await page.fill('input[placeholder="Login"]', "Tu Usuario");
  await page.fill('input[type="password"]', "Tu contraseña");
  await page.click('button.btn-success');
  await expect(page.locator('a[href="/profile"]')).toBeVisible();

  // 3️⃣ Ir a Lamborghini → Diablo
  await page.click('img[title="Lamborghini"]');
  await page.click('text=Diablo');

  // 4️⃣ Escribir un comentario muy largo
  const comentarioLargo = "Mensaje Largo".repeat(1500); // excede el límite permitido
  await page.fill('#comment', comentarioLargo);

  // 5️⃣ Intentar votar
  await page.click('button:has-text("Vote!")');

  // 6️⃣ Validar el mensaje de error
  const alerta = page.locator('.alert-danger');
  await expect(alerta).toHaveText("comment is too long");

});
