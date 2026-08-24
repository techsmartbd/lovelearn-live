import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export const revalidate = 0; // Dynamic route

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const updateScript = path.join(projectRoot, "chat_history", "update_history.js");
    const jsonFile = path.join(projectRoot, "chat_history", "history.json");
    const mdFile = path.join(projectRoot, "chat_history", "history.md");

    // Automatically trigger history refresh
    if (fs.existsSync(updateScript)) {
      try {
        execSync(`node "${updateScript}"`, { stdio: "ignore" });
      } catch (e) {
        console.error("Failed to run update_history script dynamically:", e);
      }
    }

    if (!fs.existsSync(jsonFile)) {
      return NextResponse.json({ error: "Chat history file not found" }, { status: 404 });
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
    const markdownContent = fs.existsSync(mdFile) ? fs.readFileSync(mdFile, "utf-8") : "";

    return NextResponse.json({
      success: true,
      data: {
        ...jsonData,
        markdownContent
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load chat history" }, { status: 500 });
  }
}
