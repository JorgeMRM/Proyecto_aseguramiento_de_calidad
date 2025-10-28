import { expect, test } from "@playwright/test";

test("Registro de nuevo usuario en Buggy Cars", async ({ page }) => {
  // 1️ Abrir la página principal
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1366, height: 768 });

  // 2️ Ir al enlace "Register" y esperar que cargue el formulario
  await page.click('text=Register');
  await page.waitForSelector("#username", { timeout: 15000 });

  // 3️ Crear un usuario único con timestamp
  const timestamp = Date.now();
  const username = `mario502145.176164868564945.${timestamp}`;
  console.log(username);
  // 4️ Completar el formulario de registro
  await page.fill("#username", username);
  await page.fill("#firstName", "Mariooo1a");
  await page.fill("#lastName", "Rogelll1a");
  await page.fill("#password", "Martinez500.");
  await page.fill("#confirmPassword", "Martinez500.");

  // 5️ Enviar formulario
  await page.click('button:has-text("Register")');

  // 6️ Esperar resultado (éxito o error)
  const result = page.locator(".result");
  await expect(result).toBeVisible({ timeout: 15000 });

  // 7️ Mostrar mensaje real en consola (útil para depurar)
  const mensaje = await result.textContent();
  console.log("Mensaje mostrado:", mensaje?.trim());

  // 8️ Validar registro exitoso
  await expect(result).toHaveText("Registration is successful");

  // 9️ Comprobar que la imagen de usuario esté visible
  await expect(page.locator(".img-fluid")).toBeVisible();

   // 10 Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);
});

