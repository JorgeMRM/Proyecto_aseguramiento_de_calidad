import { expect, test } from "@playwright/test";

test("Ver el funcionamiento incorrecto al hacer clic en la imagen del modelo del carro Diablo", async ({ page }) => {
  // Abrir el sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1366, height: 768 });

  // Clic en el logo de Lamborghini
  await page.click('img[title="Lamborghini"]');

  // Clic en el modelo
  await page.click('text=	Diablo');


  // Localizar la imagen del modelo Diablo
  const imagenModelo = page.locator('a[href="/"] img.img-fluid');
  await expect(imagenModelo).toBeVisible();

  // Guardar URL antes del clic
  const urlAntes = page.url();

  // Hacer clic en la imagen
  await imagenModelo.click();

  // Esperar la carga de redirección
  await page.waitForLoadState("networkidle");

  // Obtener la URL después del clic
  const urlDespues = page.url();

  // Validar el comportamiento
  if (urlDespues === "https://buggy.justtestit.org/") {
    console.log("Funcionamiento incorrecto al darle clic en la imagen se redirige al inicio.");
  } else if (urlAntes === urlDespues) {
    console.log(" La imagen no se amplió ni cambió la vista.");
  } else {
    console.log(" La imagen se comportó correctamente se agrando y no te regreso al inicio.");
  }

  // Pausa breve para visualizar resultado en modo headed
  await page.waitForTimeout(5000);
});
