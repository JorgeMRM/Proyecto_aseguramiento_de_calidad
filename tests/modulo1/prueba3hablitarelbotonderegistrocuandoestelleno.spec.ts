import { expect, test } from "@playwright/test";

test("Register: botón se habilita solo con todos los campos completos (con logs)", async ({ page }) => {
  try {
    await page.goto("https://buggy.justtestit.org/");
    await page.getByRole("link", { name: /register/i }).click();
    await page.waitForSelector("#username");

    const btn = page.getByRole("button", { name: /register/i });

    // Estado inicial
    await expect(btn).toBeDisabled();

    // Rellenar paso a paso y verificar que siga deshabilitado
    await page.fill("#username", "usuario1z.demo");
    await expect(btn).toBeDisabled();

    await page.fill("#firstName", "Mariozzz");
    await expect(btn).toBeDisabled();

    await page.fill("#lastName", "Rogelzzz");
    await expect(btn).toBeDisabled();

    await page.fill("#password", "Passw0rd.");
    await expect(btn).toBeDisabled();

    // Al completar confirmación, debe habilitarse
    await page.fill("#confirmPassword", "Passw0rd.");
    await expect(btn).toBeEnabled();

    console.log("✅ OK: El botón 'Register' estuvo deshabilitado al inicio y se habilitó al completar todos los campos.");
  } catch (err) {
    console.error("❌ ERROR: El comportamiento del botón 'Register' no fue el esperado.");
    console.error(err);
    throw err; // re-lanza para que el test falle en Playwright
  }
    //  Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);
});
