import { expect, test } from "@playwright/test";

test("Se coloca letras inválidas → mixto inválido en edad si sale esto porque si funciona", async ({ page }) => {
  const USER = "mario502145.1761648685649";
  const PASS = "Martinez500.";

  await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });
  // --- Login ---
  await page.locator('input[name="login"]').fill(USER);
  await page.locator('input[name="password"]').fill(PASS);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page.getByRole("link", { name: /profile/i })).toBeVisible();

  // --- Ir a Profile ---
  await page.getByRole("link", { name: /profile/i }).click();
  await expect(page).toHaveURL(/\/profile/i);
  await page.waitForSelector('#age, input[name="age"]', { timeout: 15000 });

  // Selectores y alerts
  const age = page.locator('#age, input[name="age"]');
  const save = page.getByRole("button", { name: /^save$/i });
  const alerts = page.getByRole("alert");
  const successAlert = alerts.filter({ hasText: /the profile has been saved/i });
  const errorAlert   = alerts.filter({ hasText: /unknown\s+error|invalid|error/i });

  // Helper: navegar por UI para re-cargar el formulario y leer valor persistido
  const reopenProfile = async () => {
    await page.getByRole("link", { name: /home|buggy rating/i }).first().click().catch(() => {});
    await page.getByRole("link", { name: /profile/i }).click();
    await page.waitForSelector('#age, input[name="age"]', { timeout: 15000 });
  };

  // === A) Número válido: 25 -> debe GUARDAR ===
  await age.fill("");
  await age.fill("25");
  await save.click();
  await expect(successAlert).toBeVisible({ timeout: 7000 }).catch(() => {});
  await reopenProfile();
  await expect(age).toHaveValue("25");
  console.log("✅ A) Age=25 guardado y persistió.");

  // === B) Solo letras: 'abcd' -> debe FALLAR y NO cambiar el valor persistido ===
  await age.fill("");
  await age.fill("abcd");
  await save.click();
  await expect(errorAlert).toBeVisible({ timeout: 7000 });
  await reopenProfile();
  await expect(age).toHaveValue("25"); // sigue igual porque no debe guardar
  console.log("✅ B) Letras rechazadas y Age sigue en 25.");

  // === C) Mixto número+letras: '25ab' -> debe FALLAR y NO cambiar el valor persistido ===
  await age.fill("");
  await age.fill("25ab");
  await save.click();
  await expect(errorAlert).toBeVisible({ timeout: 7000 });
  await reopenProfile();
  await expect(age).toHaveValue("25"); // se mantiene
  console.log("✅ C) Mixto rechazado y Age sigue en 25.");
});

