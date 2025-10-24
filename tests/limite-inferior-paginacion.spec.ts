import { test, expect } from "@playwright/test";

test("Verificar que el botón « esté deshabilitado en la primera página de la sección 'Overall Rating'", async ({ page }) => {
  // Abrir el sitio principal
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  // Ir a la sección "Overall Rating"
  await page.click('a[href="/overall"] img.img-fluid.center-block');
  await expect(page).toHaveURL(/\/overall/i);

  // Localizar el botón con texto «
  const botonAnterior = page.locator('a.btn', { hasText: '«' });

  // Esperar que sea visible
  await expect(botonAnterior).toBeVisible();

  // Obtener su clase actual
  const clases = await botonAnterior.getAttribute("class");
  console.log(`🔍 Clases del botón con «: ${clases}`);

  // Verificar que tiene la clase "disabled"
  if (clases?.includes("disabled")) {
    console.log("✅ El botón « está deshabilitado correctamente en la página 1.");
  } else {
    console.log("❌ El botón « NO está deshabilitado en la página 1 (debería estarlo).");
  }

  // Validación con expect formal
  expect(clases).toContain("disabled");
});
