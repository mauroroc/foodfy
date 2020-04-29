** a- Na busca, além de procurar por nome da receita, é possível procurar por nome do chef também.
** b- Explicar a escolha da tabela de receitas para NÃO armazenar vetores.
** c- Para efeito de teste da paginação, ao buscar pela string "henrique" retorna 3 registros, onde cada página exibe apenas 2, ficando assim duas páginas.
(help) d- Na administração, está dando erro quando adicionar um ingrediente na tela de editar

--------- Falta colocar o recurso de menu ativo no site e na adm
--------- Aplicar validação do e-mail
--------- Aplicar tratamento em todas as mensagens de erro
--------- Estilizar a mensagem de erro no padrão do projeto (falta usuarios)
--------- Criar um redirecionamento da rota admin para login
--------- Aplicar o delete cascade nas fotos de uma receita e nas fotos de um chef
--------- Está salvando receita sem nenhuma foto
--------- Rotina editar de receita está com erro (mudar no banco para salvar como vetor)
--------- Erro sem tratamento quando cria chef sem foto

2- O usuário que tiver o valor de true no campo is_admin da tabela users será considerado o administrador do sistema e:
    d- Não poderá deletar sua própria conta
7- Crie uma estratégia que quando o administrador criar um usuário novo, o sistema irá criar uma senha aleatória e enviar por email ao usuário criado. DICA*: Use a estratégia de criação de TOKEN que você viu nas aulas*.
14- Quando utilizar os alertas?
    a- Na criação, atualização ou remoção uma receita, chef, conta de usuário, bem como login e logout.
    b- Quando falhar, exiba um alerta de erro.
    c- Caso haja sucesso na transação, exibir alerta de sucesso.
    d- Caso haja algum erro de validação de campos do formulário, sinalizar de forma visual.
15- Emails
    b- Quando um usuário for cadastrado no sistema, ele irá receber um email com o acesso ao sistema.