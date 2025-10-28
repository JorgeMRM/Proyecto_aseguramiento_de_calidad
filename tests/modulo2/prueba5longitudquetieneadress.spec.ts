import { expect, test } from "@playwright/test";

test("Profile: mostrar en pantalla 'address is too long' cuando el texto excede el límite", async ({ page }) => {
  const USER = "mario502145.1761648685649";
  const PASS = "Martinez500.";
  const MAX_HEIGHT_PX = 300;

  await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="login"]').fill(USER);
  await page.locator('input[name="password"]').fill(PASS);
  await page.getByRole("button", { name: /^login$/i }).click();

  await page.getByRole("link", { name: /profile/i }).click();
  await expect(page).toHaveURL(/\/profile/i);

  const address = page.locator('#address, textarea[name="address"], textarea#address');
  await address.waitFor({ state: "visible", timeout: 15000 });

  // Utilidades
  const getHeight = async () => address.evaluate((el: HTMLElement) => el.offsetHeight);
  const resultMsg = page.locator(".result, .alert.alert-danger");
  const findTooLong = resultMsg.filter({ hasText: /address is too long/i });

  // ============== A) TEXTO PERMITIDO ==============
  await test.step("A) Guardar texto permitido", async () => {
    const allowedText = "Chiquimulilla Santa Rosa, Zona 0 Centro, Ciudad";
    await address.fill(allowedText);

    // Guardar y esperar a que la SPA procese
    await page.getByRole("button", { name: /^save$/i }).click();
    await page.waitForLoadState("networkidle").catch(() => {});

    // Validaciones suaves (si fallan, NO detienen la fase B)
    const hA = await getHeight();
    console.log(`📏 Altura tras permitido: ${hA}px`);
    await expect.soft(hA).toBeLessThanOrEqual(MAX_HEIGHT_PX);

    // Mensaje de éxito (suele ser ".result alert alert-success")
    const success = resultMsg.filter({ hasText: /the profile has been saved/i });
    await expect.soft(success.first()).toBeVisible({ timeout: 5000 });

    // Persistencia real
    await page.getByRole("link", { name: /home|buggy rating/i }).first().click().catch(() => {});
    await page.getByRole("link", { name: /profile/i }).click();
    await expect(address).toHaveValue(allowedText);
    console.log("✅ Texto permitido guardado y persistió.");
  });

  // ============== B) TEXTO DEMASIADO LARGO ==============
  await test.step("B) Exceder límite: mensaje 'address is too long' y tamaño ≤ 300px", async () => {
    const longText = "Lorem ipsum dolor sit amet ".repeat(40); // 800+ chars
    await address.fill(longText);

    // Disparar validación sin depender de Save (esta página muestra el error al perder foco)
    await address.blur();                            // quita foco
    await page.keyboard.press("Tab").catch(() => {}); // extra por si acaso

    // Si tu instancia SOLO muestra el error al guardar, descomenta:
    // await page.getByRole("button", { name: /^save$/i }).click();

    // Esperar mensaje específico visible
    await expect(findTooLong.first()).toBeVisible({ timeout: 5000 });

    // Medir tamaño (no debería pasar 300 px)
    const hB = await getHeight();
    console.log(`📏 Altura tras MUY largo: ${hB}px`);
    await expect(hB).toBeLessThanOrEqual(MAX_HEIGHT_PX);

    // Reabrir para confirmar que NO se guardó el texto largo (mantiene último válido o limpia)
    await page.getByRole("link", { name: /home|buggy rating/i }).first().click().catch(() => {});
    await page.getByRole("link", { name: /profile/i }).click();
    await address.waitFor({ state: "visible" });
    const persisted = await address.inputValue();

    // La app suele conservar el último permitido; si tu variante lo limpia, permitimos "" como válido.
    expect([ "Calle Principal 123, Zona Centro, Ciudad", "" ]).toContain(persisted);
    console.log("✅ Mostró 'address is too long', no creció >300px y el valor largo NO persistió.");
  });
});
