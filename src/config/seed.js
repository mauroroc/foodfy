const { hash } = require('bcryptjs');
const faker = require('faker');
const User = require('../app/models/User');
const Chef = require('../app/models/Chef');
const File = require('../app/models/File');
const Recipe = require('../app/models/Recipe');

const totalChefs = 12;
const totalRecipes = 60;
const totalFiles = 300;
let chefsIds = [];
let recipesIds = [];
let filesIds = [];
let recipeFilesIds = [];
let filesIdsChefs = [];
const photosRecipes = ['asinhas.png', 'burger.png', 'doce.png', 'espaguete.png', 'lasanha.png', 'pizza.png'];
const photoChefs = ['bela.jpg','rita.jpg','oliver.jpg','claude.jpg','atala.jpg','paola.jpg','fogaca.jpg','erick.jpg'];

async function init() {
    const passwordHash = await hash('teste', 8);
    const data = {
        name: 'admin',
        email: 'admin@teste.com.br',
        password: passwordHash,
        is_admin: true
    };
    await User.create(data); 
    console.log('Inserido usuário admin@teste.com.br com senha: teste');
    await createFileChefs();
    await createChefs();
    await createRecipes();
    await createFiles();
    await createRelationRecipeFiles();
}

async function createFileChefs() {
    try {
        const files = [];
        while (files.length < totalChefs) {
            photo = photoChefs[Math.floor(Math.random() * 6)]
            files.push({
                name: photo,
                path: `public/img/${photo}`
            });
        }
        const filesPromise = files.map(file => File.createSeedFile(file));
        filesIdsChefs = await Promise.all(filesPromise);
        console.log(`Foram inseridos ${filesIdsChefs.length} Fotos de Chefs`)
    } catch (error) {
        console.log(error);
    }
}

async function createChefs() {
    try {
        const chefs = [];
        while (chefs.length < totalChefs) {
            chefs.push({
                name: faker.name.firstName(),
                file_id: filesIdsChefs[Math.floor(Math.random() * filesIdsChefs.length)]
            });
        }
        const chefsPromise = chefs.map(chef => Chef.create(chef));
        chefsIds = await Promise.all(chefsPromise);
        console.log(`Foram inseridos ${chefsIds.length} Chefs`)
    } catch (error) {
        console.log(error);
    }
    
}

async function createRecipes() {
    try {
        const recipes = [];
        while (recipes.length < totalRecipes) {
            recipes.push({
                title: faker.commerce.productName(),
                ingredients: geraPalavras(Math.ceil(Math.random() * 5)),
                preparation: geraFrases(Math.ceil(Math.random() * 5)),
                information: faker.lorem.paragraph(),
                chef_id: chefsIds[Math.floor(Math.random() * totalChefs)], 
                user_id: 1 // aqui tem que ser o id do usuário admin
            });
        }
        const recipesPromise = recipes.map(recipe => Recipe.create(recipe));
        recipesIds = await Promise.all(recipesPromise);
        console.log(`Foram inseridas ${recipesIds.length} Receitas`)
    } catch (error) {
        console.log(error);
    }
}

async function createFiles() {
    try {
        const files = [];
        while (files.length < totalFiles) {
            files.push({
                name: faker.image.image(),
                path: `public/img/${photosRecipes[Math.floor(Math.random() * 6)]}`
            });
        }
        const filesPromise = files.map(file => File.createSeedFile(file));
        filesIds = await Promise.all(filesPromise);
        console.log(`Foram inseridos ${filesIds.length} Fotos de Receitas`)
    } catch (error) {
        console.log(error);
    }
}

async function createRelationRecipeFiles() {
    try {
        const recipeFiles = [];
        let file = 0;
        while (recipeFiles.length < totalFiles) {
            recipeFiles.push({
                recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)],
                file_id: filesIds[file]
            })
            file++;
        }
        const recipeFilesPromise = recipeFiles.map(recipeFile => File.createRecipeFile(recipeFile));
        recipeFilesIds = await Promise.all(recipeFilesPromise);
        console.log(`Foram inseridos ${recipeFilesIds.length} Relacionamentos entre Receitas e Arquivos`)
    } catch (error) {
        console.log(error);
    } 
}

function geraPalavras(quantidade) {
    const palavras = [];
    while (palavras.length < quantidade) {
        palavras.push(faker.lorem.words());
    }
    return palavras;
}

function geraFrases(quantidade) {
    const frases = [];
    while (frases.length < quantidade) {
        frases.push(faker.lorem.sentence());
    }
    return frases;
}

init();