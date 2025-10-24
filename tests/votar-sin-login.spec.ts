import { test, expect } from "@playwright/test";

test("Intentar votar sin iniciar sesión (usuario no autenticado)", async ({ page }) => {
  // Abrir el sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1920, height: 1050});

  // Clic en el logo de Lamborghini
  await page.click('img[title="Lamborghini"]');

  // Clic en el modelo 
  await page.click('text=Veneno');

  const mensaje = page.locator(".card-text");
  await expect(mensaje).toHaveText("You need to be logged in to vote.", { timeout: 10000 });

  console.log(" El sistema impidió votar sin iniciar sesión, mensaje mostrado correctamente.");
});
