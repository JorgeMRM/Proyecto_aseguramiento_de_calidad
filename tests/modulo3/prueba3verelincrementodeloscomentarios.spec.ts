import { expect, test } from "@playwright/test";

test("El contador de votos se incrementa al votar por un auto", async ({ page }) => {
  // 1️ Abrir el sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1366, height: 768 });

  // 2️ Iniciar sesión
  await page.waitForSelector('input[placeholder="Login"]');
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[placeholder="Login"]', "mario502145.1761648685649."); // Cambiar por tu usuario
  await page.fill('input[type="password"]', "Martinez500."); // Cambiar por tu contraseña
  await page.click('button.btn-success');
  await expect(page.locator('a[href="/profile"]')).toBeVisible();

  // 3️ Ir a Lamborghini → Diablo
  await page.click('img[title="Lamborghini"]');
  await page.click('text=Diablo');

  // 4️ Obtener el contador de votos actual (usa el <strong>)
  const votosLocator = page.locator('h4 strong');
  const votosAntesTexto = await votosLocator.textContent();
  const votosAntes = parseInt(votosAntesTexto?.trim() || "0", 10);
  console.log("Votos antes del voto:", votosAntes);

  // 5️ Escribir comentario y votar
  await page.fill('#comment', "Que lindo nunca visto prueba 2 rm");
  await page.click('button:has-text("Vote!")');
  await page.waitForLoadState("networkidle");

  // 6️ Validar mensaje de confirmación
  const mensaje = page.locator(".card-text");
  await expect(mensaje).toHaveText("Thank you for your vote!", { timeout: 10000 });

  // 7️ Obtener nuevamente el número de votos
  const votosDespuesTexto = await votosLocator.textContent();
  const votosDespues = parseInt(votosDespuesTexto?.trim() || "0", 10);
  console.log("Votos después del voto:", votosDespues);

  // 8️ Verificar incremento
  expect(votosDespues).toBe(votosAntes + 1);

  // 9️ Dejar visible la pantalla por 8 segundos
  await page.waitForTimeout(8000);
});
