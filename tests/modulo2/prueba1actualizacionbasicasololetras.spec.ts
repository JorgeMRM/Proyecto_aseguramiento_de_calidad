import { expect, test } from "@playwright/test";

test("Perfil: actualizar y verificar persistencia navegando vía UI", async ({ page }) => {
  const USER = "mario502145.1761648685649";
  const PASS = "Martinez500.";
  const desiredFirst = "Lucas";
  const desiredLast  = "Gonzalo";

  await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });

  // Login
  await page.locator('input[name="login"]').fill(USER);
  await page.locator('input[name="password"]').fill(PASS);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page.getByRole("link", { name: /profile/i })).toBeVisible();

  // Ir a Profile
  await page.getByRole("link", { name: /profile/i }).click();
  await expect(page).toHaveURL(/\/profile/i);

  // Editar y guardar
  const first = page.locator('#firstName, input[name="firstName"]');
  const last  = page.locator('#lastName, input[name="lastName"]');
  await first.fill(desiredFirst);
  await last.fill(desiredLast);
  await page.getByRole("button", { name: /^save$/i }).click();

  // Alert visible (si existe)
  const successAlert = page.getByRole("alert").filter({ hasText: /the profile has been saved/i });
  await successAlert.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});

  // ✅ Verificación inmediata tras guardar
  await expect(first).toHaveValue(desiredFirst);
  await expect(last).toHaveValue(desiredLast);

  // 🔁 Persistencia: navega por la UI (sin reload)
  // Ir a Home y regresar a Profile
  await page.getByRole("link", { name: /home|buggy rating/i }).first().click().catch(() => {});
  await page.getByRole("link", { name: /profile/i }).click();

  // Esperar el form (tolerante a variaciones)
  await page.waitForSelector('#firstName, input[name="firstName"]', { timeout: 15000 });
  await expect(page.locator('#firstName, input[name="firstName"]')).toHaveValue(desiredFirst);
  await expect(page.locator('#lastName, input[name="lastName"]')).toHaveValue(desiredLast);

  console.log(`✅ Cambios persistieron: ${desiredFirst} ${desiredLast}`);
});
