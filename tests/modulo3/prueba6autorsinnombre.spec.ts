import { expect, test } from "@playwright/test";

test("Validar que el usuario tenga nombre configurado antes de comentar", async ({ page }) => {
  //  Abrir el sitio
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 710, height: 735 });

  //  Iniciar sesión con usuario sin nombre configurado
  await page.fill('input[placeholder="Login"]', "mario502145.1761648685649.");
  await page.fill('input[type="password"]', "Martinez500.");
  await page.click('button.btn-success');
  await expect(page.locator('a[href="/profile"]')).toBeVisible();

  //  Ir a Lamborghini → Diablo
  await page.click('img[title="Lamborghini"]');
  await page.click('text=Diablo');

  //  Agregar comentario
  const comentario = `
Probando el campo vacio de autor
  `;
  await page.fill('#comment', comentario);
  await page.click('button:has-text("Vote!")');
  await page.waitForLoadState("networkidle");

  //  Validar que el comentario se haya publicado
  const comentarioTabla = page.locator('table tr').last();
  await expect(comentarioTabla).toBeVisible();

  //  Obtener los valores de la fila
  const columnas = comentarioTabla.locator('td');
  const autor = await columnas.nth(1).textContent(); // Columna Author
  const comentarioTexto = await columnas.nth(2).textContent(); // Columna Comment

  console.log("Autor:", autor?.trim());
  console.log("Comentario:", comentarioTexto?.trim());

  // 7️ Validar si el autor está vacío (BUG detectado)
  if (!autor?.trim()) {
    console.warn("Un tremendo bug el comentario se publico sin autor y solo aprece el comentario.");
  }

  //  Marcar como fallo si el autor está vacío
  expect(autor?.trim()?.length).toBeGreaterThan(0);
});
