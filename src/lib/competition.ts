import chalk from "chalk";

export interface Competitor {
  name: string;
  url: string;
  description: string;
  stars: number;
  lastUpdated: string;
  language?: string;
  topics?: string[];
}

export interface CompetitionResult {
  summary: string;
  competitors: Competitor[];
  insights: {
    strengths: string[];
    gaps: string[];
    yourEdge?: string;
  };
}

export async function searchCompetitors(oneLiner: string): Promise<CompetitionResult> {
  console.log(chalk.dim("  🔍 Searching GitHub for competitors..."));

  try {
    // Step 1: Extract search keywords from one-liner
    const keywords = extractKeywords(oneLiner);
    console.log(chalk.dim(`     Keywords: ${keywords.join(", ")}`));

    // Step 2: Search GitHub repos
    const competitors = await searchGitHubRepos(keywords);

    if (competitors.length === 0) {
      console.log(chalk.dim("     No direct competitors found on GitHub"));
      return {
        summary: "No direct GitHub competitors found. This could mean:\n- You're in a new space (good!)\n- Different search terms needed\n- Competition exists outside GitHub",
        competitors: [],
        insights: {
          strengths: [],
          gaps: ["No established GitHub solutions"],
          yourEdge: "First mover advantage in this space",
        },
      };
    }

    console.log(chalk.dim(`     Found ${competitors.length} potential competitors`));

    // Step 3: Analyze competitors
    const insights = analyzeCompetitors(competitors, oneLiner);

    // Step 4: Generate summary
    const summary = generateSummary(competitors, insights);

    return {
      summary,
      competitors,
      insights,
    };
  } catch (error) {
    console.log(chalk.yellow(`     ⚠️  Competition search failed: ${error}`));
    return {
      summary: "Competition search unavailable. Manual research recommended.",
      competitors: [],
      insights: {
        strengths: [],
        gaps: [],
      },
    };
  }
}

/**
 * Extract search keywords from one-liner
 */
function extractKeywords(oneLiner: string): string[] {
  // Remove common words
  const stopWords = ["a", "an", "the", "for", "with", "that", "this", "and", "or", "but"];

  const words = oneLiner
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.includes(w));

  // Take top 3-4 most relevant words
  return words.slice(0, 4);
}

/**
 * Search GitHub repos via API
 */
async function searchGitHubRepos(keywords: string[]): Promise<Competitor[]> {
  const { spawnCommand } = await import("./runtime.js");

  // Build search query
  const query = keywords.join(" ");
  const searchQuery = `${query} in:name,description,readme stars:>50`;

  try {
    const result = await spawnCommand(
      [
        "gh",
        "api",
        "search/repositories",
        "-f",
        `q=${searchQuery}`,
        "-f",
        "sort=stars",
        "-f",
        "order=desc",
        "-f",
        "per_page=10",
      ],
      { stdout: "pipe", stderr: "pipe" }
    );

    const data = JSON.parse(result.stdout);

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Parse results
    return data.items.slice(0, 8).map((item: any) => ({
      name: item.full_name,
      url: item.html_url,
      description: item.description || "No description",
      stars: item.stargazers_count,
      lastUpdated: item.updated_at,
      language: item.language,
      topics: item.topics || [],
    }));
  } catch (error) {
    console.log(chalk.dim(`     GitHub search error: ${error}`));
    return [];
  }
}

/**
 * Analyze competitors to find strengths and gaps
 */
function analyzeCompetitors(competitors: Competitor[], oneLiner: string): CompetitionResult["insights"] {
  // Sort by stars to find market leaders
  const sorted = [...competitors].sort((a, b) => b.stars - a.stars);
  const topCompetitors = sorted.slice(0, 3);

  const strengths: string[] = [];
  const gaps: string[] = [];

  // Analyze stars distribution
  if (topCompetitors[0]?.stars > 1000) {
    strengths.push(`Established market (${topCompetitors[0].name} has ${topCompetitors[0].stars.toLocaleString()} stars)`);
  } else {
    gaps.push("No dominant player (top repo has <1k stars)");
  }

  // Check activity
  const recentlyActive = competitors.filter((c) => {
    const lastUpdate = new Date(c.lastUpdated);
    const monthsAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo < 6;
  });

  if (recentlyActive.length < competitors.length / 2) {
    gaps.push("Many repos inactive (>6 months since update)");
  }

  // Check language diversity
  const languages = new Set(competitors.map((c) => c.language).filter(Boolean));
  if (languages.size > 3) {
    strengths.push(`Multiple implementations (${Array.from(languages).join(", ")})`);
  }

  // Analyze topics for feature coverage
  const allTopics = competitors.flatMap((c) => c.topics || []);
  const topicCounts = allTopics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonTopics = Object.entries(topicCounts)
    .filter(([_, count]) => count >= 3)
    .map(([topic]) => topic);

  if (commonTopics.length > 0) {
    strengths.push(`Common themes: ${commonTopics.slice(0, 5).join(", ")}`);
  }

  return {
    strengths,
    gaps,
    yourEdge: gaps.length > 0 ? "Opportunity to fill gaps in existing solutions" : undefined,
  };
}

/**
 * Generate human-readable summary
 */
function generateSummary(competitors: Competitor[], insights: CompetitionResult["insights"]): string {
  const topCompetitors = competitors.slice(0, 5);

  let summary = `Found ${competitors.length} potential competitors on GitHub:\n\n`;

  // List top competitors
  summary += "**Top competitors:**\n";
  topCompetitors.forEach((c, i) => {
    summary += `${i + 1}. [${c.name}](${c.url}) - ${c.stars.toLocaleString()}⭐ - ${c.description.slice(0, 80)}${c.description.length > 80 ? "..." : ""}\n`;
  });

  summary += "\n**Market insights:**\n";

  if (insights.strengths.length > 0) {
    summary += "\nStrengths of existing solutions:\n";
    insights.strengths.forEach((s) => summary += `- ${s}\n`);
  }

  if (insights.gaps.length > 0) {
    summary += "\nGaps you could exploit:\n";
    insights.gaps.forEach((g) => summary += `- ${g}\n`);
  }

  if (insights.yourEdge) {
    summary += `\n**Your edge:** ${insights.yourEdge}`;
  }

  return summary;
}
