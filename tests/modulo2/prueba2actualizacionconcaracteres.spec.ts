import { expect, test } from "@playwright/test";

test("si deja actualizar nombre con caracteres y numeros", async ({ page }) => {
  // === Credenciales provistas ===
  const USER = "mario502145.1761648685649";
  const PASS = "Martinez500.";

  // Nombres nuevos (únicos para esta corrida)
  const newFirst = `Mario$Upd${Date.now().toString().slice(-4)}`;
  const newLast  = `Rogel$Upd${Date.now().toString().slice(-4)}`;

  // 1) Ir al sitio e iniciar sesión
  await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });

  // En Buggy normalmente el login está en el home. Si no, haz click en "Login".
  // (esto es tolerante a ambas UIs)
  const userInput = page.locator('input[name="login"], #username, input[placeholder*="Login" i]');
  const passInput = page.locator('input[name="password"], #password, input[type="password"]');
  const loginBtn  = page.getByRole("button", { name: /^login$/i });

  await userInput.fill(USER);
  await passInput.fill(PASS);
  await loginBtn.click();

  // Espera señal de sesión iniciada (link Profile o botón Logout)
  const profileLink = page.getByRole("link", { name: /profile/i });
  const logoutLink  = page.getByRole("link", { name: /logout/i });
  await Promise.race([profileLink.waitFor(), logoutLink.waitFor()]);

  // 2) Ir a Profile
  if (await profileLink.isVisible()) {
    await profileLink.click();
  } else {
    // Fallback: si no hay link visible, intenta navegar directo
    await page.goto("https://buggy.justtestit.org/profile");
  }
  await page.waitForSelector("#firstName", { timeout: 10000 });

  // 3) Actualizar First Name y Last Name
  const firstName = page.locator("#firstName");
  const lastName  = page.locator("#lastName");
  const saveBtn   = page.getByRole("button", { name: /^save$/i });

  await firstName.fill(newFirst);
  await lastName.fill(newLast);

  // 4) Guardar
  await saveBtn.click();

  // 5) Verificar mensaje de éxito y que los campos reflejen los nuevos valores
  const result = page.locator(".result");
  await expect(result).toBeVisible({ timeout: 10000 });
  await expect(result).toHaveText(/the profile has been saved successful/i);
  await expect(firstName).toHaveValue(newFirst);
  await expect(lastName).toHaveValue(newLast);

  console.log("✅ OK: 'The profile has been saved successful' y los campos quedaron actualizados.");

  // (Opcional) Re-cargar la página para confirmar persistencia
  // await page.reload();
  // await expect(page.locator("#firstName")).toHaveValue(newFirst);
  // await expect(page.locator("#lastName")).toHaveValue(newLast);
   // 5️ Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);
});
