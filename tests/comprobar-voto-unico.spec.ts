import { test, expect } from "@playwright/test";

test("Verificar que no se pueda votar otra vez", async ({ page }) => {
  // 1️⃣ Ingresar al sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  // 2️⃣ Iniciar sesión
  await page.waitForSelector('input[placeholder="Login"]');
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[placeholder="Login"]', "tu usuario");
  await page.fill('input[type="password"]', "tu contraseña");
  await page.click('button.btn-success');

  // 3️⃣ Ir a Lamborghini → Diablo
  await page.click('img[title="Lamborghini"]');
  await page.click('text=Diablo');
  
  // 6️⃣ Verificar el mensaje mostrado
  const mensaje = page.locator(".card-text");
   await expect(mensaje).toHaveText("Thank you for your vote!", { timeout: 10000 });

});
