import { NextRequest, NextResponse } from "next/server";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { queue } from "@/utils/queue";

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter,
});

serverAdapter.setBasePath("/api/bullboard");

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace("/api/bullboard", "");

    // Handle static assets and API routes differently
    if (pathname.startsWith("/static/") || pathname.includes(".")) {
      // For static assets, we need to serve them properly
      return new NextResponse("Static asset not found", { status: 404 });
    }

    // For the main Bull Board UI, we need to handle it differently
    if (pathname === "/" || pathname === "") {
      // Return a simple HTML page that loads Bull Board
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bull Board</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .container { max-width: 1200px; margin: 0 auto; }
              .header { margin-bottom: 20px; }
              .queue-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .queue-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
              .stat-card { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
              .stat-value { font-size: 24px; font-weight: bold; color: #333; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bull Board - Queue Dashboard</h1>
                <p>Monitor your BullMQ queues</p>
              </div>
              <div class="queue-info">
                <h3>Queue Status</h3>
                <div class="queue-stats">
                  <div class="stat-card">
                    <div class="stat-label">Queue Name</div>
                    <div class="stat-value">${queue.name}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-label">Status</div>
                    <div class="stat-value">${(await queue.isPaused()) ? "Paused" : "Active"}</div>
                  </div>
                </div>
              </div>
              <div class="queue-info">
                <h3>Quick Actions</h3>
                <p>Use the API endpoints to interact with your queues:</p>
                <ul>
                  ${(await queue.getJobs()).map((job) => `<li><code>GET /api/bullboard/jobs/${job.id}</code> - ${job.name} - ${job.data.file.name || "Default"}</li>`).join("")}
                </ul>
              </div>
            </div>
          </body>
        </html>
      `;

      return new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Handle API routes
    if (pathname === "/queues") {
      const queueInfo = {
        name: queue.name,
        waiting: await queue.getWaiting(),
        active: await queue.getActive(),
        completed: await queue.getCompleted(),
        failed: await queue.getFailed(),
        delayed: await queue.getDelayed(),
      };

      return NextResponse.json(queueInfo);
    }

    if (pathname === "/jobs") {
      const jobs = await queue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
        "delayed",
      ]);
      return NextResponse.json(jobs);
    }

    // Default response
    return NextResponse.json({ message: "Bull Board API", path: pathname });
  } catch (error) {
    console.error("Bull Board error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace("/api/bullboard", "");

    if (pathname === "/jobs") {
      const body = await req.json();
      const job = await queue.add(
        body.name || "default",
        body.data || {},
        body.options || {}
      );
      return NextResponse.json({
        message: "Job added successfully",
        jobId: job.id,
      });
    }

    return NextResponse.json({ message: "POST endpoint", path: pathname });
  } catch (error) {
    console.error("Bull Board POST error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: "PUT not implemented" }, { status: 501 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { message: "DELETE not implemented" },
    { status: 501 }
  );
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json(
    { message: "PATCH not implemented" },
    { status: 501 }
  );
}
