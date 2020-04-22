** a- Na busca, além de procurar por nome da receita, é possível procurar por nome do chef também.
** b- Explicar a escolha da tabela de receitas para NÃO armazenar vetores.
** c- Para efeito de teste da paginação, ao buscar pela string "henrique" retorna 3 registros, onde cada página exibe apenas 2, ficando assim duas páginas.
(help) d- Na administração, está dando erro quando adicionar um ingrediente na tela de editar

--------- Falta colocar o recurso de menu ativo no site e na adm

DESAFIO 9 - SISTEMA DE LOGIN
Nesse desafio você irá implementar os conceitos de cadastro e sessão de usuários aprendidos nos módulos 9 e 10. Você deve criar a parte de autenticação de usuários no Foodfy, onde somente os usuários cadastrados, poderão ter acesso à parte administrativa do sistema.

1- A partir de agora, somente usuários cadastrados poderão ter acesso às rotas /admin
2- O usuário que tiver o valor de true no campo is_admin da tabela users será considerado o administrador do sistema e:
    a - Poderá criar/editar/deletar qualquer usuário, receita e chef
    b- Somente este poderá cadastrar/atualizar/deletar os chefs
    c- Somente este poderá cadastrar outros usuários
    d- Não poderá deletar sua própria conta
3- Um usuário comum não pode
    a- Editar ou deletar as receitas de outro usuário
    b- Editar ou deletar outros usuários
    c- Criar, editar ou deletar chefs
    d- Deletar sua própria conta.
4- As listagem de receitas e chefs continuam acessíveis a todos, tanto para usuários do sistema como para visitantes do site. (criar uma tela de acesso aberto para ver os chefs do Foodfy)
5- A partir disso, cuidado com os botões de acesso que existem no site e na área administrativa, bem como com as rotas do site. Crie uma estrutura de proteção para impedir o acesso a usuários não autenticados.
6- Crie uma estrutura de proteção para impedir que os usuários que estão autenticados**, mas não são administradores**, não tenham permissão de acesso a certas rotas, conforme as instruções acima.
7- Crie uma estratégia que quando o administrador criar um usuário novo, o sistema irá criar uma senha aleatória e enviar por email ao usuário criado. DICA*: Use a estratégia de criação de TOKEN que você viu nas aulas*.
8- Use a estrutura de rotas que você aprendeu nas aulas, para criar as rotas de entrar e sair do sistema (login/logout); solicitação de recuperação de senha; gerenciamento de usuários.
9- Coloque as rotas de perfis de usuário e gerenciamento de usuários da seguinte forma:
    // Rotas de perfil de um usuário logado
    routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
    routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado
    // Rotas que o administrador irá acessar para gerenciar usuários
    routes.get('/admin/users', UserController.list) //Mostrar a lista de usuários cadastrados
    routes.post('/admin/users', UserController.post) //Cadastrar um usuário
    routes.put('/admin/users', UserController.put) // Editar um usuário
    routes.delete('/admin/users', UserController.delete) // Deletar um usuário
10- Crie uma tabela de nome users com os seguintes campos:
    id SERIAL PRIMARY KEY
    name TEXT NOT NULL
    email TEXT UNIQUE NOT NULL
    password TEXT NOT NULL
    reset_token TEXT
    reset_token_expires TEXT
    is_admin BOOLEAN DEFAULT false
    created_at TIMESTAMP DEFAULT(now())
    updated_at TIMESTAMP DEFAULT(now())
11- ATENÇÃO: Você vai precisar criar relacionamentos entre usuários e receitas para cumprir a regra onde o usuário poderá ver a lista de receitas criadas por ele mesmo e somente ele poderá deletar uma receita criada por ele. Portanto, crie uma chave estrangeira foreign key de nome user_id na tabela de receitas, apontando para o id do usuário.
12 - Sessão de Usuário - Para usar a biblioteca express-session que trabalha com sessão e utiliza a configuração pg_simple; você vai precisar da tabela abaixo.
    CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE "session" 
    ADD CONSTRAINT "session_pkey" 
    PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
13- Telas - O sistema irá ter as seguintes telas
    Tela de login;
    Tela de pedido de recuperação de senha (O sistema irá enviar um email com o link de recuperação);
    Tela de recuperação de senha;
    Tela de informações do usuário (O usuário deverá preencher sua senha para alterar suas informações);
    Tela de listagem de receitas do usuário (Mostrar somente as receitas cadastradas pelo usuário logado);
    Tela de listagem/gerenciamento de usuários do sistema (LEMBRE: Somente o administrador tem acesso a essa parte do sistema).
14- Quando utilizar os alertas?
    a- Na criação, atualização ou remoção uma receita, chef, conta de usuário, bem como login e logout.
    b- Quando falhar, exiba um alerta de erro.
    c- Caso haja sucesso na transação, exibir alerta de sucesso.
    d- Caso haja algum erro de validação de campos do formulário, sinalizar de forma visual.
15- Emails
    a- Você deverá criar estratégias de envio de emails para o Foodfy
    b- Quando um usuário for cadastrado no sistema, ele irá receber um email com o acesso ao sistema.
    c- Quando um usuário esquecer a senha, e fizer o pedido de recuperação, ele irá receber no email dele um link especial para a página de recuperação de senha.