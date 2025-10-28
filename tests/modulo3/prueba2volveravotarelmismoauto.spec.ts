import { expect, test } from "@playwright/test";

test("Verificar que no se pueda votar otra vez", async ({ page }) => {
  // 1️ Ingresar al sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1366, height: 768 }); // tamaño típico de pantalla PC

  // 2️ Iniciar sesión
  await page.waitForSelector('input[placeholder="Login"]');
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[placeholder="Login"]', "mario5021.");
  await page.fill('input[type="password"]', "Martinez500.");
  await page.click('button.btn-success');

  // 3️ Ir a Lamborghini → Diablo
  await page.click('img[title="Lamborghini"]');
  await page.click('text=Diablo');

  // 4️ Verificar el mensaje mostrado
  const mensaje = page.locator(".card-text");
  await expect(mensaje).toHaveText("Thank you for your vote!", { timeout: 10000 });

  // 5️ Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);
});
