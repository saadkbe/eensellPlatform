import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const artifactDir = `C:\\Users\\saadk\\.gemini\\antigravity\\brain\\549d8b0c-37b0-44c0-bed5-002c5f9ea9f8`;
const publicModulesDir = path.join(__dirname, "public", "modules");

const coverMappings = [
  { order: 0, src: "mod1_foundations_1782352020098.png", dest: "mod1_foundations.png" },
  { order: 1, src: "mod2_tools_1782352044051.png", dest: "mod2_tools.png" },
  { order: 2, src: "mod3_content_1782352077929.png", dest: "mod3_content.png" },
  { order: 3, src: "mod4_viral_1782352101156.png", dest: "mod4_viral.png" },
  { order: 4, src: "mod5_ads_1782352126673.png", dest: "mod5_ads.png" },
  { order: 5, src: "mod6_automation_1782352152625.png", dest: "mod6_automation.png" },
  { order: 6, src: "mod7_chatbots_1782352177282.png", dest: "mod7_chatbots.png" },
  { order: 7, src: "mod8_business_1782352204238.png", dest: "mod8_business.png" },
  { order: 8, src: "mod9_client_1782352229506.png", dest: "mod9_client.png" },
  { order: 9, src: "mod10_branding_1782352254296.png", dest: "mod10_branding.png" },
  { order: 10, src: "mod11_freelance_1782352273601.png", dest: "mod11_freelance.png" },
  { order: 11, src: "mod12_saas_1782352293327.png", dest: "mod12_saas.png" },
  { order: 12, src: "mod13_video_1782352317479.png", dest: "mod13_video.png" },
  { order: 13, src: "mod14_productivity_1782352342383.png", dest: "mod14_productivity.png" },
  { order: 14, src: "mod15_money_1782352364506.png", dest: "mod15_money.png" },
  { order: 15, src: "mod16_website_1782352388745.png", dest: "mod16_website.png" },
  { order: 16, src: "mod17_marketing_1782352411205.png", dest: "mod17_marketing.png" },
  { order: 17, src: "mod2_tools_1782352044051.png", dest: "mod18_prompt.png" },
  { order: 18, src: "mod15_money_1782352364506.png", dest: "mod19_ecommerce.png" },
  { order: 19, src: "mod1_foundations_1782352020098.png", dest: "mod20_trends.png" },
];

async function main() {
  console.log("📂 Ensuring public/modules directory exists...");
  if (!fs.existsSync(publicModulesDir)) {
    fs.mkdirSync(publicModulesDir, { recursive: true });
  }

  console.log("🖼️ Copying generated images to public/modules...");
  for (const mapping of coverMappings) {
    const srcPath = path.join(artifactDir, mapping.src);
    const destPath = path.join(publicModulesDir, mapping.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${mapping.dest}`);
    } else {
      console.warn(`⚠️ Source file not found: ${srcPath}`);
    }
  }

  console.log("💾 Updating database module records with new imageUrls...");
  const modules = await prisma.module.findMany({ orderBy: { order: 'asc' } });

  for (const mod of modules) {
    const mapping = coverMappings.find(m => m.order === mod.order);
    if (mapping) {
      const imageUrl = `/modules/${mapping.dest}`;
      await prisma.module.update({
        where: { id: mod.id },
        data: { imageUrl }
      });
      console.log(`✅ Updated Module "${mod.title}" -> ${imageUrl}`);
    }
  }

  console.log("🎉 All module covers successfully updated!");
}

main().finally(async () => {
  await prisma.$disconnect();
  process.exit(0);
});
