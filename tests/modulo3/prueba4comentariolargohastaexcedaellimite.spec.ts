import { expect, test } from "@playwright/test";

test("si te sale este mensaje es porque el comentario excede el limite pertimido de caracteres en el comentario", async ({ page }) => {
  // 1️ Ingresar al sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  // 2️ Iniciar sesión
  await page.fill('input[placeholder="Login"]', "mario5021.");
  await page.fill('input[type="password"]', "Martinez500.");
  await page.click('button.btn-success');
  await expect(page.locator('a[href="/profile"]')).toBeVisible();

  // 3️ Ir a Lamborghini → Diablo
  await page.click('img[title="Lamborghini"]');
  await page.click('text=GALLARDO');

  // 4️ Escribir un comentario muy largo
  const comentarioLargo = "Mensaje Largo".repeat(1500); // excede el límite permitido
  await page.fill('#comment', comentarioLargo);

  // 5️ Intentar votar
  await page.click('button:has-text("Vote!")');

  // 6️ Validar el mensaje de error
  const alerta = page.locator('.alert-danger');
  await expect(alerta).toHaveText("comment is too long");

   // Pausa breve para visualizar resultado en modo headed
  await page.waitForTimeout(1000);

});
