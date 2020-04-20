** a- Na busca, além de procurar por nome da receita, é possível procurar por nome do chef também.
** b- Explicar a escolha da tabela de receitas para NÃO armazenar vetores.
** c- Para efeito de teste da paginação, ao buscar pela string "henrique" retorna 3 registros, onde cada página exibe apenas 2, ficando assim duas páginas.
(help) 3- Na administração, está dando erro quando adicionar um ingrediente na tela de editar
4- Falta colocar o recurso de menu ativo no site e na adm
5- Tratar e gravar as datas do created_at no bd
6- Implementar Regra para:
    Ao deletar o chef, se o mesmo possuir pelo menos uma receita, retorne um erro informando que chefs que possuem receitas não podem ser deletados.
7- Fazer no site:
    d- Colocar links nas mais acessadas
    e- Fazer lógica das mais acessadas (deve ter em algum módulo)
8- Colocar o default now no cadastro de receitas e chefs
DESAFIO 7
a - Crie uma tabela de nome files com os campos
    id SERIAL PRIMARY KEY
    name TEXT
    path TEXT NOT NULL
b- Crie uma tabela de nome recipe_files com os campos
    id SERIAL PRIMARY KEY
    recipe_id INTEGER REFERENCES recipes(id)
    file_id INTEGER REFERENCES files(id)
c- Você vai precisar buscar as imagens de uma receita, criando um relacionamento entre as tabelas recipe_files com a tabela files
d- Adicionar imagens às receitas.
    No banco de dados, remova o campo image, pois não será mais necessário.
    Crie um campo de upload de imagens
    Coloque um limite de 5 imagens
    A receita deve ter pelo menos uma imagem
e- Adicionar a imagem de avatar para o chef
    Remova o campo avatar_url da tabela de chefs
    Adicione o campo file_id INTEGER REFERENCES files(id)
    Você vai precisar criar um relacionamento entre chefs e files
    Dica: Use ALTER TABLE para fazer as alterações da tabela de chefs.
f- No site, mostrar as novas imagens de receitas e chefs que estarão cadastradas no banco de dados.
g- Na página de detalhe de uma receita, criar uma funcionalidade de troca de imagens conforme imagem abaixo.
h- Aplique os conceitos de async/await e de try/catch que você aprendeu nas aulas.
DESAFIO 8 - ORGANIZAÇÃO DAS RECEITAS
DESAFIO 9 - SISTEMA DE LOGIN