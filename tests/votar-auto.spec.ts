import { test, expect } from "@playwright/test";

test.setTimeout(60000);

test("Votar por un auto en Buggy Cars", async ({ page }) => {
  // 1️⃣ Ir al sitio y loguearse
  await page.goto("https://buggy.justtestit.org/");
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.waitForSelector('input[name="login"]');
  await page.waitForSelector('input[name="password"]');

  await page.fill('input[name="login"]', "tu usuario"); // tu usuario
  await page.fill('input[name="password"]', "tu contraseña"); // tu password
  await page.click('button:has-text("Login")');
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();

  // 2️⃣ Navegar al modelo Lamborghini Diablo
  await page.goto(
    "https://buggy.justtestit.org/model/ckl2phsabijs71623vk0%7Cckl2phsabijs71623vqg"
  );

  // 3️⃣ Confirmar que la página del modelo cargó
  await page.waitForSelector("h3", { timeout: 20000 });
  const titulo = await page.textContent("h3");
  console.log("📘 Modelo cargado:", titulo);

  // 4️⃣ Intentar encontrar botón o mensaje
  const voteButton = page.locator('button:has-text("Vote!")');
  const alreadyVoted = page.locator("text=You have already voted");
  const thankYou = page.locator("text=Thank you for your vote!");

  // Espera hasta que aparezca alguno
  await page.waitForTimeout(3000); // tiempo extra por si hay retraso en render

  if (await voteButton.isVisible()) {
    console.log("🟢 Botón de voto encontrado, procediendo a votar...");
    await page.fill("#comment", "Excelente vehículo, me encanta su diseño!");
    await voteButton.click();
    await expect(thankYou).toBeVisible({ timeout: 10000 });
    console.log("✅ Voto realizado correctamente.");
  } else if (await alreadyVoted.isVisible()) {
    console.log("ℹ️ Ya habías votado por este modelo anteriormente.");
  } else if (await thankYou.isVisible()) {
    console.log("✅ Ya aparece el mensaje de voto exitoso.");
  } else {
    // capturar screenshot para depurar
    await page.screenshot({ path: "error_votar_auto.png", fullPage: true });
    throw new Error("❌ No se encontró el botón de voto ni mensajes visibles.");
  }
});
