import { expect, test } from "@playwright/test";

test("Verificar que el botón  esté deshabilitado en la primera página de la sección 'Overall Rating'", async ({ page }) => {
  // Abrir el sitio principal
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1366, height: 768 });

  // Ir a la sección "Overall Rating"
  await page.click('a[href="/overall"] img.img-fluid.center-block');
  await expect(page).toHaveURL(/\/overall/i);

  // Localizar el botón con texto «
  const botonAnterior = page.locator('a.btn', { hasText: '«' });

  // Esperar que sea visible
  await expect(botonAnterior).toBeVisible();

  // Obtener su clase actual
  const clases = await botonAnterior.getAttribute("class");
  console.log(`Clases del botón con «: ${clases}`);

  // Verificar que tiene la clase "disabled"
  if (clases?.includes("disabled")) {
    console.log("El botón « no deja ir para atras depues de la página 1 es lo correcto.");
  } else {
    console.log("El botón « si deja ir para atras depues de la página 1 no tendria que pasar eso.");
  }

  // Validación con expect formal
  expect(clases).toContain("disabled");

  // 9️ Dejar visible la pantalla por 8 segundos
  await page.waitForTimeout(8000);
});

