const puppeteer = require("puppeteer");

async function sendMessages(phone, message, count, delay) {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./whatsapp-session" // Keeps you logged in
    });

    const page = await browser.newPage();
    await page.goto("https://web.whatsapp.com", { waitUntil: "networkidle2" });

    console.log("Scan the QR code to log in...");
    await page.waitForSelector("div[role='grid']", { timeout: 120000 }); // Chat list

    console.log("Logged in successfully!");
    await page.goto(`https://web.whatsapp.com/send?phone=${phone}`, { waitUntil: "networkidle2" });

    // **Wait for the message input field**
    const inputSelector = "div[contenteditable='true'][data-tab='10']"; // More specific selector
    await page.waitForSelector(inputSelector, { timeout: 60000 });

    for (let i = 0; i < count; i++) {
        // **Click on the input field first**
        await page.click(inputSelector);
        await page.type(inputSelector, `${message} #${i + 1}`);

        // **Press "Enter" to send the message**
        await page.keyboard.press("Enter");

        console.log(`Sent message ${i + 1} to ${phone}`);

        // **Wait before sending the next message**
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log("All messages sent! ✅");
    await browser.close();
}

// **Example: Send 1000 messages with a 3-second delay**
sendMessages("+919112348199", "your whats app got hacked successfully ", 1000, 100);
