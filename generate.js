const path = require('path');
const fs = require('fs');
const yamlFront = require('yaml-front-matter');

function getFrontMatter(path, directoryPath, file) {
    const filePath = path.join(directoryPath, file);
    const fileContents = fs.readFileSync(filePath);
    return yamlFront.loadFront(fileContents);
}

function getPostsMetaData(data, file) {
    return {
        name: data.name,
        title: data.title,
        subtitle: data.subtitle,
        page: data.page,
        date: data.date,
        file: file
    };
}

function getPagesMetaData(data, file) {
    return {
        title: data.title,
        page: data.page,
		navbar: data.navbar,
        file: file
    };
}

const postsDirectory = path.join(__dirname, 'src', 'assets', 'posts');
const postsFiles = fs.readdirSync(postsDirectory);

const pagesDirectory = path.join(__dirname, 'src', 'assets', 'pages');
const pagesFiles = fs.readdirSync(pagesDirectory);


const postsData = postsFiles.map(file => {
    const data = getFrontMatter(path, postsDirectory, file);
    return getPostsMetaData(data, file);
});

const pagesData = pagesFiles.map(file => {
    const data = getFrontMatter(path, pagesDirectory, file);
    return getPagesMetaData(data, file);
});

const data = {
    posts: postsData,
    pages: pagesData
}

const jsonData = JSON.stringify(data);

fs.writeFileSync('src/assets/index.json', jsonData);