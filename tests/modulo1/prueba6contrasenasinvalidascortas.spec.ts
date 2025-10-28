import { expect, test } from "@playwright/test";

type CasoPwd = {
  titulo: string;
  password: string;
  // si true, intentamos primero que esté disabled; si no lo está, validamos error server-side
  esperaDisabled?: boolean;
};

const casos: CasoPwd[] = [
  { titulo: "demasiado corta (<6)", password: "Ab1.", esperaDisabled: true },
  { titulo: "sin mayúsculas",       password: "passw0rd.", esperaDisabled: false },
  { titulo: "sin símbolo",          password: "Passw0rd",  esperaDisabled: false },
];

test.describe("Register: NO permite contraseñas inválidas", () => {
  for (const c of casos) {
    test(`Contraseña inválida: ${c.titulo}`, async ({ page }, testInfo) => {
      await page.goto("https://buggy.justtestit.org/", { waitUntil: "domcontentloaded" });
      await page.getByRole("link", { name: /register/i }).click();
      await page.waitForSelector("#username");

      // username único aun en paralelo
      const unique = `${Date.now()}-${testInfo.parallelIndex}-${Math.random().toString(36).slice(2,7)}`;
      const username = `pwdinvalid.${unique}`;

      await page.fill("#username", username);
      await page.fill("#firstName", "Mario");
      await page.fill("#lastName", "Rogel");
      await page.fill("#password", c.password);
      await page.fill("#confirmPassword", c.password);

      const btn = page.getByRole("button", { name: /register/i });

      if (c.esperaDisabled) {
        // Si el front deshabilita: OK y terminamos
        if (await btn.isDisabled()) {
          console.log(`✅ OK (${c.titulo}): botón deshabilitado con contraseña inválida.`);
          return;
        }
        // Si no está deshabilitado, seguimos por el camino server-side:
        console.log(`ℹ️ (${c.titulo}): botón habilitado; validaremos rechazo del backend.`);
      }

      // Click si está habilitado (si no, ya habríamos retornado arriba)
      if (await btn.isEnabled()) {
        await btn.click();
      }

      const result = page.locator(".result");
      await expect(result).toBeVisible({ timeout: 7000 });

      const texto = (await result.textContent())?.trim() || "";
      console.log(`📜 (${c.titulo}) Mensaje:`, texto || "(vacío)");

      // Nunca debe ser éxito
      expect(texto).not.toMatch(/registration\s+is\s+successful/i);

      // Aceptamos diversas redacciones del backend
      const esPolicyError =
        /minimum\s+field\s+size\s+of\s+6/i.test(texto) ||
        /password\s+not\s+long\s+enough/i.test(texto) ||
        /did\s+not\s+conform\s+with\s+policy/i.test(texto) ||
        /invalidpasswordexception/i.test(texto);

      if (!esPolicyError) {
        await page.screenshot({
          path: `tests-output/pwd-invalida-${c.titulo.replace(/\s+/g, "_")}-${Date.now()}.png`,
          fullPage: true,
        });
      }
      expect(esPolicyError, `Debe rechazarse por política de contraseña (${c.titulo}).`).toBeTruthy();

      await expect(page).toHaveURL(/\/register$/);
      console.log(`✅ OK (${c.titulo}): rechazo correcto (server-side o client-side).`);
    });
  }
});

