import { expect, test } from "@playwright/test";

test("Register: muestra error cuando las contraseñas no coinciden (sin hacer submit)", async ({ page }) => {
  try {
    // Abrir y navegar a Register
    await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /register/i }).click();
    await page.waitForSelector("#username");

    // Localizadores
    const username    = page.locator("#username");
    const firstName   = page.locator("#firstName");
    const lastName    = page.locator("#lastName");
    const password    = page.locator("#password");
    const confirmPass = page.locator("#confirmPassword");
    const btnRegister = page.getByRole("button", { name: /register/i });

    // Completar todos los campos con contraseñas diferentes
    await username.fill("usuario.demo");    // no se envía, puede ser fijo
    await firstName.fill("Mario");
    await lastName.fill("Rogel");
    await password.fill("Passw0rd.");
    await confirmPass.fill("Passw0rdX.");

    // Disparar validación (blur)
    await confirmPass.press("Tab"); // o: await firstName.click();

    // Esperar el mensaje de error visible en la página (sin hacer clic en Register)
    const error = page.getByText(/passwords?\s+do\s+not\s+match/i);
    await expect(error).toBeVisible({ timeout: 5000 });

    // (Opcional) mientras haya mismatch, el botón debería seguir deshabilitado
    await expect(btnRegister).toBeDisabled();

    // (Opcional) confirmar que seguimos en /register (no se envió nada)
    await expect(page).toHaveURL(/\/register$/);

    console.log("OK: Se mostró automáticamente el mensaje 'Passwords do not match' sin hacer clic en Register.");
  } catch (e) {
    console.error("ERROR: No apareció el mensaje de contraseñas no coincidentes como se esperaba.");
    console.error(e);
    throw e;
  }
      //  Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);
});
