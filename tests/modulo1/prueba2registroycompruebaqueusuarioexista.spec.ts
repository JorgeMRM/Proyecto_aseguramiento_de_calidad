import { expect, test } from '@playwright/test';

test('El usuario ya esta registrado', async ({ page }) => {
  // 1 Abrir la página principal
  await page.goto('https://buggy.justtestit.org/');
  await page.setViewportSize({ width: 1366, height: 768 });

  // 2Ir al enlace "Register"
  await page.click('text=Register');

  // 3 Completar el formulario de registro
  await page.fill('#username', 'mario5021.');
  await page.fill('#firstName', 'Mariooo');
  await page.fill('#lastName', 'Rogelll');
  await page.fill('#password', 'Martinez500.');
  await page.fill('#confirmPassword', 'Martinez500.');

  // 4 Enviar formulario
  await page.click('button:has-text("Register")');

  // 5 Verificar texto de confirmación
  await expect(page.locator('.result')).toHaveText('Registration is successful');

  // 6 Comprobar que la imagen de usuario esté presente
  await expect(page.locator('.img-fluid')).toBeVisible();

  // 10 Esperar 5 segundos para observar el mensaje
  await page.waitForTimeout(7000);
});
