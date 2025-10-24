import { test, expect } from '@playwright/test';

test('Registro de nuevo usuario en Buggy Cars', async ({ page }) => {
  // 1 Abrir la página principal
  await page.goto('https://buggy.justtestit.org/');
  await page.setViewportSize({ width: 710, height: 735 });

  // 2Ir al enlace "Register"
  await page.click('text=Register');

  // 3 Completar el formulario de registro
  await page.fill('#username', 'leopoldo8.');
  await page.fill('#firstName', 'Juana');
  await page.fill('#lastName', 'Perez');
  await page.fill('#password', 'Carmen100.');
  await page.fill('#confirmPassword', 'Carmen100.');

  // 4 Enviar formulario
  await page.click('button:has-text("Register")');

  // 5 Verificar texto de confirmación
  await expect(page.locator('.result')).toHaveText('Registration is successful');

  // 6 Comprobar que la imagen de usuario esté presente
  await expect(page.locator('.img-fluid')).toBeVisible();
});
