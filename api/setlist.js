import { renderToString } from "react-dom/server";
import puppeteer from "puppeteer";
import SetListView from "../src/components/setlist";
import { getSetList, getOutputs } from "../src/utils/setlists";
import { supabase } from "../src/supabaseClient";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    // Fetch the setlist and outputs data
    const setlist = await getSetList(id);
    const outputs = await getOutputs(id);

    // Render the React component to a string
    const html = renderToString(
      <SetListView setlist={setlist} outputs={outputs} />
    );

    // Generate the OG image using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content for Puppeteer
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Team Chords - ${setlist.name}</title>
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);

    // Capture a screenshot
    const screenshot = await page.screenshot({ type: "png" });

    // Close the browser
    await browser.close();

    // Upload the screenshot to Supabase Storage
    const fileName = `og-image-${id}.png`;
    const { error } = await supabase.storage
      .from("og-images") // Replace with your bucket name
      .upload(fileName, screenshot, {
        contentType: "image/png",
      });

    if (error) {
      console.error("Error uploading image to Supabase Storage:", error);
      throw error;
    }

    // Get the public URL of the uploaded image
    let imageResponse = supabase.storage.from("og-images").getPublicUrl(fileName);

    if (imageResponse.error) {
        // Generate the OG image using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content for Puppeteer
        await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Team Chords - ${setlist.name}</title>
            </head>
            <body>
            <div id="root">${html}</div>
            </body>
        </html>
        `);

        // Capture a screenshot
        const screenshot = await page.screenshot({ type: "png" });

        // Close the browser
        await browser.close();

        // Upload the screenshot to Supabase Storage
        const fileName = `og-image-${id}.png`;
        const { error } = await supabase.storage
            .from("og-images")
            .upload(fileName, screenshot, {
                contentType: "image/png",
            });

        if (error) {
            console.error("Error uploading image to Supabase Storage:", error);
            throw error;
        }

        imageResponse = supabase.storage.from("og-images").getPublicUrl(fileName);
    }

    // Return the rendered HTML with the OG image
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Team Chords - ${setlist.name}</title>
          <meta property="og:title" content="${setlist.name}" />
          <meta property="og:description" content="View and manage your setlist with Team Chords." />
          <meta property="og:image" content="${imageResponse.data.publicUrl}" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://tc.aebibtech.com/api/setlist?id=${id}" />
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error rendering React component:", error);
    res.status(500).send("Internal Server Error");
  }
}