/** biome-ignore-all assist/source/organizeImports: reason */
import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(req: Request) {
  await connection();
  try {
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Poppins-SemiBold.ttf",
    );
    const imagePath = path.join(process.cwd(), "public", "logo.png");

    const fontData = await readFile(fontPath);
    const imageBuffer = await readFile(imagePath);

    const imageBase64 = imageBuffer.toString("base64");
    const imageSrc = `data:image/png;base64,${imageBase64}`;

    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "NPRESEC MIS";
    const description =
      searchParams.get("description") ||
      "World School Management Information system designed to streamline and automate repetitive school administrative tasks.";

    const dynamicImageUrl = searchParams.get("picture");
    return new ImageResponse(
      <div
        style={{ fontFamily: "Poppins" }}
        tw="flex w-[1200px] h-[630px] bg-slate-950 text-white overflow-hidden items-stretch">
        {/* LEFT SIDEBAR: Brand & Identity */}
        <div tw="flex flex-col justify-between items-center w-[360px] bg-slate-900 border-r border-slate-800 p-12">
          {/* Top decorative element */}
          <div tw="flex items-center text-xs tracking-widest text-blue-400 font-semibold uppercase">
            Official Platform
          </div>

          {/* Centerpiece Logo container */}
          <div tw="flex p-6 bg-slate-950/50 rounded-3xl border border-slate-800/80 shadow-2xl justify-center items-center">
            {/** biome-ignore lint/performance/noImgElement: reason */}
            <img
              width={200}
              height={dynamicImageUrl ? 180 : 140}
              src={dynamicImageUrl ? dynamicImageUrl : imageSrc}
              alt="School Logo"
              style={{
                objectFit: dynamicImageUrl ? "cover" : "contain",
                objectPosition: dynamicImageUrl
                  ? "top center"
                  : "center center",
              }}
            />
          </div>

          {/* Bottom accent badge */}
          <div tw="flex px-4 py-1.5 bg-blue-700/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
            Active System
          </div>
        </div>

        {/* RIGHT PANEL: Content Area with subtle mesh gradient background */}
        <div tw="flex flex-col justify-center flex-1 p-16 relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/20">
          {/* System category indicator */}
          <div tw="text-blue-700 font-semibold text-lg tracking-wide mb-4 uppercase">
            Management Information System
          </div>

          {/* Main Title Heading */}
          <h1 tw="text-6xl font-bold tracking-tight text-slate-800 leading-tight mb-4">
            {title}
          </h1>

          {/* Divider Line */}
          <div tw="h-[4px] w-24 bg-blue-700/50  mb-6" />

          {/* Meta Description */}
          <p tw="text-slate-500 text-lg font-normal leading-relaxed max-w-[680px]">
            {description}
          </p>

          {/* Bottom subtle watermark grid decor */}
          <div tw="border border-blue-500 shadow-xl absolute bg-blue-700/10 rounded-2xl p-2 bottom-6 right-12 text-slate-600 text-xs font-mono tracking-widest uppercase">
            SECURE PORTAL
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Poppins",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (err) {
    console.error(err);
    return new Response("Failed to generate og Image", { status: 500 });
  }
}
