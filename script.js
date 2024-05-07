const CARD_TEMPLATE = `<div class=card><a class=repo-link href=REPO_URL target=_blank><svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M15.5 2.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V4.06l-6.22 6.22a.75.75 0 1 1-1.06-1.06L19.94 3h-3.69a.75.75 0 0 1-.75-.75Z"></path><path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.25.25 0 0 0-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 0 0 .25-.25v-8.5a.75.75 0 0 1 1.5 0v8.5a1.75 1.75 0 0 1-1.75 1.75H4.25a1.75 1.75 0 0 1-1.75-1.75V4.25Z"></path></svg></a><div class=image-div style=background-image:url(IMAGE_URL)></div><div class=details-div><div><p class=title>TITLE<p class=stars><svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="m12.672.668 3.059 6.197 6.838.993a.75.75 0 0 1 .416 1.28l-4.948 4.823 1.168 6.812a.75.75 0 0 1-1.088.79L12 18.347l-6.116 3.216a.75.75 0 0 1-1.088-.791l1.168-6.811-4.948-4.823a.749.749 0 0 1 .416-1.279l6.838-.994L11.327.668a.75.75 0 0 1 1.345 0Z"></path></svg> STARS<p class=forks><svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M8.75 19.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM15 4.75a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm-12.5 0a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM5.75 6.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 6.5ZM12 21a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 12 21Zm6.25-14.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 18.25 6.5Z"></path><path d="M6.5 7.75v1A2.25 2.25 0 0 0 8.75 11h6.5a2.25 2.25 0 0 0 2.25-2.25v-1H19v1a3.75 3.75 0 0 1-3.75 3.75h-6.5A3.75 3.75 0 0 1 5 8.75v-1Z"></path><path d="M11.25 16.25v-5h1.5v5h-1.5Z"></path></svg>FORKS</div><p class=details>DESCRIPTION</div></div>`
const formContainer = document.getElementById('form-container');
const showcaseContainer = document.getElementById('showcase-container');
const refreshBtn = document.getElementById('refresh-btn');
const cardContainer = document.getElementById('card-container');
const loadImg1 = document.getElementById('load-img1');
const loadImg2 = document.getElementById('load-img2');
const topType = document.getElementById('top-type');
const loadMoreBtn = document.getElementById('load-more-btn');

const GITHUB_USERNAME = new URLSearchParams(window.location.search).get('user');
let page = 1;

loadImg1.style.display = 'none';


async function getTopRepositories(username, type, max = 10, reload = false) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const url = `https://api.github.com/users/${username}/repos?type=owner&per_page=100&sort=updated`;
    let response

    if (reload === true) {
        const timestamp = new Date().getTime()
        response = await fetch(url + '&t=' + timestamp);
    }
    else {
        response = await fetch(url);
    }
    const repos = await response.json();

    if (!response.ok) {
        throw new Error(`Error fetching repos for user ${username}\n\n${repos.message}`);
    }
    if (response.message) {
        throw new Error(`Error fetching repos for user ${username}\n\n${repos.message}`);
    }

    let sortedRepos = [];

    if (type === 'sum') {
        sortedRepos = repos.sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count));
    }
    else if (type === 'forks') {
        sortedRepos = repos.sort((a, b) => b.forks_count - a.forks_count);
    }
    else if (type === 'stars') {
        sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    return sortedRepos.slice(0, max);
}


async function LoadData(isLoadMore, reload) {
    let scrollPos = 0;

    if (isLoadMore === true) {
        if (page > 1) {
            scrollPos = loadMoreBtn.getBoundingClientRect().top + window.scrollY;
        }
    }

    cardContainer.innerHTML = ''
    loadImg2.style.display = 'block';
    loadMoreBtn.style.display = 'none';

    const type = topType.value;
    let repos = [];
    try {
        repos = await getTopRepositories(GITHUB_USERNAME, type, page * 10, reload = reload);
    }
    catch (error) {
        alert(error);
        return;
    }

    let pos = 0;
    for (const repo of repos) {
        pos++;
        const name = repo.name;
        const full_name = repo.full_name;
        const description = repo.description || '';
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        const url = repo.html_url;
        const image = `https://socialify.git.ci/${full_name}/image?font=Jost&language=1&name=1&pattern=Solid&theme=Light`

        let title = `${pos}. ${name}`;
        if (title.length > 20) title = title.substring(0, 17) + '...';

        cardContainer.innerHTML += CARD_TEMPLATE.replace('REPO_URL', url).replace('IMAGE_URL', image).replace('TITLE', title).replace('STARS', stars).replace('FORKS', forks).replace('DESCRIPTION', description);
    }

    loadImg2.style.display = 'none';
    loadMoreBtn.style.display = 'flex';
    window.scrollTo({
        top: scrollPos - 200,
        behavior: "smooth"
    });
}

if (!GITHUB_USERNAME) {
    formContainer.style.display = 'block';
    showcaseContainer.style.display = 'none';
}
else {
    formContainer.style.display = 'none';
    showcaseContainer.style.display = 'block';
    LoadData(isLoadMore = false, reload = true);
    refreshBtn.addEventListener('click', function () { LoadData(isLoadMore = false, reload = true) });
    topType.addEventListener('change', function () { LoadData(isLoadMore = false, reload = false) });
    loadMoreBtn.addEventListener('click', function () {
        page++;
        LoadData(isLoadMore = true, reload = false);
    });
}