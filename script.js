const GITHUB_USERNAME = 'TechShreyash'
const refreshButton = document.getElementById('refresh-button');

async function getTopStarredRepositories(username, max = 10) {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await fetch(url);
    console.log(response.ok);
    if (!response.ok) {
        throw new Error(`Error fetching repos for user ${username}`);
    }
    if (response.message) {
        throw new Error(`Error fetching repos for user ${username}\n\n${response.message}`);
    }

    const repos = await response.json();
    const sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    return sortedRepos.slice(0, max);
}

async function LoadData() {

}