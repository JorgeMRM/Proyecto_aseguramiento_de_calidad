import { test, expect } from "@playwright/test";

test("Verificar límite de paginación en la sección 'Overall Rating'", async ({ page }) => {
  // Abrir el sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  // Hacer clic en la imagen de "Overall Rating"
  await page.click('a[href="/overall"] img.img-fluid.center-block');

  // Esperar que cargue la página /overall
  await expect(page).toHaveURL(/\/overall/i);

  // Localizador del botón siguiente de la paginación (el que contiene »)
  const botonSiguiente = page.locator('a.btn', { hasText: '»' });

  // Localizador del campo de página actual (por ejemplo, "page 2 of 5")
  const textoPagina = page.locator('text=/page \\d+ of \\d+/i');

  // Intentar avanzar más allá del límite
  for (let i = 0; i < 7; i++) {
    await botonSiguiente.click();
    await page.waitForTimeout(700);
  }

  // Obtener el texto actual que indica la página (ej. "page 5 of 5")
  const textoActual = await textoPagina.textContent();
  console.log(`📄 Texto de paginación actual: ${textoActual}`);

  // Extraer el número de la página actual
  const match = textoActual?.match(/page (\d+) of (\d+)/i);
  const paginaActual = match ? parseInt(match[1], 10) : NaN;
  const paginaMaxima = match ? parseInt(match[2], 10) : 5;

  // Verificar que la página actual no exceda el límite
  if (paginaActual > paginaMaxima) {
    console.log(`❌ Error: El sistema permite avanzar hasta la página ${paginaActual}, excediendo el límite (${paginaMaxima}).`);
  } else {
    console.log(`✅ El sistema detuvo la paginación correctamente en la página ${paginaActual} de ${paginaMaxima}.`);
  }

  // Validar con expect que no exceda el límite
  expect(paginaActual).toBeLessThanOrEqual(paginaMaxima);
});
