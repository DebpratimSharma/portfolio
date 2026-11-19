import { NextResponse } from "next/server";

export type GitHubContributionResponse = {
  success: boolean;
  total?: number;
  contributions?: { date: string; count: number }[];
  error?: string;
};

export async function GET() {
  const username = "DebpratimSharma";

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        next: { revalidate: 3600 }, // Cache on server for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from contributions API: ${res.status}`);
    }

    const data = await res.json();
    const contributions = (data.contributions || []).map(
      (item: { date: string; count: number }) => ({
        date: item.date,
        count: item.count,
      })
    );

    return NextResponse.json({
      success: true,
      total: data.total?.lastYear ?? 0,
      contributions,
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch live GitHub contributions",
      },
      { status: 500 }
    );
  }
}
