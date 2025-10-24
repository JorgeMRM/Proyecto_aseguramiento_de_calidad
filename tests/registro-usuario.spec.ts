import { test, expect } from "@playwright/test";

test("Registro de nuevo usuario en Buggy Cars", async ({ page }) => {
  // 1️⃣ Abrir la página principal
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  // 2️⃣ Ir al enlace "Register" y esperar que cargue el formulario
  await page.click('text=Register');
  await page.waitForSelector("#username", { timeout: 15000 });

  // 3️⃣ Crear un usuario único con timestamp
  const timestamp = Date.now();
  const username = `leopoldo${timestamp}`;

  // 4️⃣ Completar el formulario de registro
  await page.fill("#username", username);
  await page.fill("#firstName", "Juana");
  await page.fill("#lastName", "Perez");
  await page.fill("#password", "Carmen100.");
  await page.fill("#confirmPassword", "Carmen100.");

  // 5️⃣ Enviar formulario
  await page.click('button:has-text("Register")');

  // 6️⃣ Esperar resultado (éxito o error)
  const result = page.locator(".result");
  await expect(result).toBeVisible({ timeout: 15000 });

  // 7️⃣ Mostrar mensaje real en consola (útil para depurar)
  const mensaje = await result.textContent();
  console.log("Mensaje mostrado:", mensaje?.trim());

  // 8️⃣ Validar registro exitoso
  await expect(result).toHaveText("Registration is successful");

  // 9️⃣ Comprobar que la imagen de usuario esté visible
  await expect(page.locator(".img-fluid")).toBeVisible();
});
