export async function getGitHubStars(repo: string): Promise<number> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub stars")
    }

    const data = await response.json()
    return data.stargazers_count
  } catch (error) {
    console.error("Error fetching GitHub stars:", error)
    return 0
  }
}
