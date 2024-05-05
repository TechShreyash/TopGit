const GITHUB_USERNAME = new URLSearchParams(window.location.search).get('user')



const formContainer = document.getElementById('form-container');
const showcaseContainer = document.getElementById('showcase-container');
const refreshButton = document.getElementById('refresh-button');
const cardContainer = document.getElementById('card-container');
const loadImg = document.getElementById('load-img');

if (!GITHUB_USERNAME) {
    formContainer.style.display = 'block';
    showcaseContainer.style.display = 'none';
}
else {
    formContainer.style.display = 'none';
    showcaseContainer.style.display = 'block';
    LoadData();
}

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
    console.log('Loading Data', GITHUB_USERNAME);
    loadImg.style.display = 'block';
    const repos = await getTopStarredRepositories(GITHUB_USERNAME);
    console.log(repos);
    
    for (const repo of repos) {
        const name = repo.name;
        const description = repo.description || '';
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        console.log(name, description, stars, forks);
    }


}