import { expect, test } from "@playwright/test";

test("Votar por el modelo Diablo (usuario autenticado)", async ({ page }) => {
  //  Abrir el sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1366, height: 768 });

  //  Esperar y llenar las credenciales
  await page.waitForSelector('input[placeholder="Login"]', { timeout: 15000 });
  await page.waitForSelector('input[type="password"]', { timeout: 15000 });

  await page.fill('input[placeholder="Login"]', "mario5021."); // CAMBIAR ESTE POR SU USUARIOOOOOOOOOO
  await page.fill('input[type="password"]', "Martinez500.");                 // CAMBIAR ESTE POR SU CONTRASEÑA

  // Hacer clic en el botón verde Login
  await page.click('button.btn-success');

  //  Verificar login exitoso
  await expect(page.locator('a[href="/profile"]')).toBeVisible({ timeout: 10000 }); //10S de espera

  //  Clic en el logo de Lamborghini
  await page.click('img[title="Lamborghini"]');


  //  Clic en el modelo Diablo
  await page.click('text=	Murciélago');


  //  Escribir el comentario (usa el id correcto: "comment")
  await page.fill('#comment', "Prueba proyecto"); //Cambiar aca por un comentario

  // Hacer clic en el botón Vote!
  await page.click('button:has-text("Vote!")');

  // Esperar que la página se recargue completamente
  await page.waitForLoadState("networkidle");

  // 🔹 Esperar a que aparezca el mensaje
  const mensaje = page.locator(".card-text");
  await expect(mensaje).toHaveText("Thank you for your vote!", { timeout: 10000 });

   // 5️ Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);

});
