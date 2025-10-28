import { expect, test } from "@playwright/test";

test("Bug encontrado si sale esto porque dejo agregar letras y numeros que no fue las dos opciones que aparecen Male y Female", async ({ page }) => {
  const USER = "mario502145.1761648685649";
  const PASS = "Martinez500.";

  // 1) Login
  await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="login"]').fill(USER);
  await page.locator('input[name="password"]').fill(PASS);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page.getByRole("link", { name: /profile/i })).toBeVisible();

  // 2) Ir a Profile
  await page.getByRole("link", { name: /profile/i }).click();
  await expect(page).toHaveURL(/\/profile/i);
  await page.waitForSelector('#gender, input[name="gender"]', { timeout: 15000 });

  const gender = page.locator('#gender, input[name="gender"]');
  const save   = page.getByRole("button", { name: /^save$/i });
  const alerts = page.getByRole("alert");
  const successAlert = alerts.filter({ hasText: /the profile has been saved/i });
  const errorAlert   = alerts.filter({ hasText: /error|invalid|unknown/i });

  const reopenProfile = async () => {
    await page.getByRole("link", { name: /home|buggy rating/i }).first().click().catch(() => {});
    await page.getByRole("link", { name: /profile/i }).click();
    await page.waitForSelector('#gender, input[name="gender"]', { timeout: 15000 });
  };

  // === A) Guardar 'Male' (válido)
  await gender.click();
  await gender.fill("Male");
  await page.keyboard.press("Enter");
  await save.click();
  await reopenProfile();
  await expect(gender).toHaveValue(/male/i);
  console.log("✅ Gender=Male persistió.");

  // === B) Guardar 'Female' (válido)
  await gender.click();
  await gender.fill("Female");
  await page.keyboard.press("Enter");
  await save.click();
  await reopenProfile();
  await expect(gender).toHaveValue(/female/i);
  console.log("✅ Gender=Female persistió.");

  // helper para probar valores inválidos y verificar rechazo
  const expectRejectedAndUnchanged = async (inputValue: string, expectedCurrent: RegExp) => {
    await gender.click();
    await gender.fill(inputValue);
    await page.keyboard.press("Enter").catch(() => {});
    await save.click();

    // Debe mostrarse alerta de error
    await expect(errorAlert).toBeVisible({ timeout: 7000 });

    // Volver a abrir Profile y confirmar que NO cambió
    await reopenProfile();
    await expect(gender).toHaveValue(expectedCurrent);

    console.log(`✅ Rechazado '${inputValue}'; Gender se mantiene en ${expectedCurrent}.`);
  };

  // === C) Letras (inválido) -> debe rechazar y NO cambiar (sigue 'Female')
  await expectRejectedAndUnchanged("Abc", /female/i);

  // === D) Solo números (inválido) -> debe rechazar y NO cambiar (sigue 'Female')
  await expectRejectedAndUnchanged("123", /female/i);
});
