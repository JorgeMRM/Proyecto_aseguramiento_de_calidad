import { expect, test } from "@playwright/test";

test("Register: NO debería permitir números en First/Last Name", async ({ page }) => {
  // 1) Abrir y llegar a Register
  await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: /register/i }).click();
  await page.waitForSelector("#username");

  // 2) Datos con números en los nombres
  const username = `numname.${Date.now()}`;
  await page.fill("#username", username);
  await page.fill("#firstName", "Mario123");  // <- contiene números
  await page.fill("#lastName", "Rogel456");   // <- contiene números
  await page.fill("#password", "Passw0rd.");
  await page.fill("#confirmPassword", "Passw0rd.");

  // 3) Enviar
  await page.getByRole("button", { name: /register/i }).click();

  // 4) Verificar resultado
  const result = page.locator(".result");
  await expect(result).toBeVisible({ timeout: 15000 });

  const text = (await result.textContent())?.trim() || "";
  console.log("Mensaje mostrado:", text);

  // 5) Aserción NEGATIVA: NO debe mostrar éxito
  const esExito = /registration\s+is\s+successful/i.test(text);

  if (esExito) {
    console.error("FALLO: El sistema permitió registrar con números en First/Last Name.");
    // Captura evidencia
    await page.screenshot({ path: `tests-output/bug-numeros-nombre-${Date.now()}.png`, fullPage: true });
    // Falla explícitamente
    expect(esExito, "El registro NO debería ser exitoso con números en los nombres").toBeFalsy();
  } else {
    console.log("OK: No se mostró 'Registration is successful' con nombres que incluyen números.");
  }
    //  Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(10000);
});
