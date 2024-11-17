$(document).ready(function () {
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });

    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');

        const scrollPosition = $(window).scrollTop() - header.outerHeight();

        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
        }

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });

    // Animações
    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%',
    });

    ScrollReveal().reveal('.item', {
        origin: 'left',
        duration: 2000,
        distance: '20%',
    });

    ScrollReveal().reveal('#appRecomendations', {
        origin: 'left',
        duration: 1000,
        distance: '20%',
    });

    ScrollReveal().reveal('#apps', {
        origin: 'right',
        duration: 1000,
        distance: '20%',
    });

    // Monitorar estado de autenticação
    firebase.auth().onAuthStateChanged((user) => {
        const loginNavItem = document.getElementById('loginNavItem');
        const loginLink = loginNavItem.querySelector('a');

        if (user) {
            const userName = user.displayName || user.email.split('@')[0];
            loginLink.textContent = userName;
            loginLink.href = "perfil.html";
        } else {
            loginLink.textContent = "Login";
            loginLink.href = "login.html";
        }
    });

    // Buscar artigos por faixa etária
    const faixaEtaria = new URLSearchParams(window.location.search).get('idade');
    const artigosContainer = $('#artigosContainer');
    artigosContainer.empty(); // Limpa o container

    if (faixaEtaria) {
        const [minIdade, maxIdade] = faixaEtaria.split('-').map(Number);

        if (isNaN(minIdade) || isNaN(maxIdade)) {
            artigosContainer.append('<p>Faixa etária inválida.</p>');
        } else {
            buscarArtigos(minIdade, maxIdade);
        }
    } else {
        artigosContainer.append('<p>Parâmetro de faixa etária não fornecido.</p>');
    }

    // Função para buscar artigos no Firestore
    function buscarArtigos(minIdade, maxIdade) {
        if (typeof db !== 'undefined') {
            db.collection('artigos')
                .where(
                    'idade',
                    'array-contains-any',
                    Array.from({ length: maxIdade - minIdade + 1 }, (_, i) => i + minIdade)
                )
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        artigosContainer.append('<p>Nenhum artigo encontrado para esta faixa etária.</p>');
                    } else {
                        querySnapshot.forEach((doc) => {
                            const artigo = doc.data();
                            artigosContainer.append(`
                                <div class="artigo" data-id="${doc.id}">
                                    <h2>${artigo.titulo}</h2>
                                    <p><strong>Idade:</strong> ${artigo.idade.join(', ')}</p>
                                    <p>${artigo.conteudo.substring(0, 150)}...</p>
                                    <a href="detalhes-artigos.html?id=${doc.id}" class="btn-default">Leia mais</a>
                                </div>
                            `);
                        });
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar artigos:', error);
                    artigosContainer.append('<p>Erro ao carregar os artigos.</p>');
                });
        } else {
            artigosContainer.append('<p>Banco de dados não configurado.</p>');
        }
    }
});

//buscar artigos
$(document).ready(function () {
    // Função para obter parâmetros da URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Obtém faixa etária da URL
    const faixaEtaria = getQueryParam('idade');
    const artigosContainer = $('#artigosContainer');
    artigosContainer.empty(); // Limpa o container

    if (faixaEtaria) {
        console.log(`Faixa etária buscada: ${faixaEtaria}`);
        const [minIdade, maxIdade] = faixaEtaria.split('-').map(Number);

        if (isNaN(minIdade) || isNaN(maxIdade)) {
            artigosContainer.append('<p>Faixa etária inválida.</p>');
            return;
        }

        // Busca artigos no Firestore
        if (typeof db !== 'undefined') {
            db.collection('artigos')
                .where(
                    'idade',
                    'array-contains-any',
                    Array.from({ length: maxIdade - minIdade + 1 }, (_, i) => i + minIdade)
                )
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        artigosContainer.append('<p>Nenhum artigo encontrado para esta faixa etária.</p>');
                    } else {
                        querySnapshot.forEach((doc) => {
                            const artigo = doc.data();
                            artigosContainer.append(`
                                <div class="artigo" data-id="${doc.id}">
                                    <h2>${artigo.titulo}</h2>
                                    <p><strong>Idade:</strong> ${artigo.idade.join(', ')}</p>
                                    <p>${artigo.conteudo.substring(0, 150)}...</p>
                                    <a href="detalhes-artigos.html?id=${doc.id}" class="btn-default">Leia mais</a>
                                </div>
                            `);
                        });
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar artigos:', error);
                    artigosContainer.append('<p>Erro ao carregar os artigos.</p>');
                });
        } else {
            artigosContainer.append('<p>Banco de dados não configurado.</p>');
        }
    } else {
        artigosContainer.append('<p>Parâmetro de faixa etária não fornecido.</p>');
    }
});

//botao 
$(document).on('click', '#buscarArtigo', function () {
    const faixaEtaria = $(this).data('idade'); // Obtém o valor do atributo data-idade
    // Redireciona para a página de artigos com o parâmetro idade na URL
    window.location.href = `artigos.html?idade=${faixaEtaria}`;
});

// ir até o artigo
$(document).on('click', '.artigo', function () {
    const artigoId = $(this).data('id');
    window.location.href = `detalhes-artigos.html?id=${artigoId}`;
});




// Evento de clique no botão de pesquisa
$('#searchButton').on('click', function () {
    const searchQuery = $('#searchQuery').val().trim(); // Obter o valor do campo de pesquisa

    if (searchQuery) {
        // Redirecionar para a página de resultados com o termo de busca
        window.location.href = `pesquisa.html?q=${encodeURIComponent(searchQuery)}`;
    } else {
        alert('Por favor, insira um termo para pesquisar.');
    }
});


// pesquisa
$(document).ready(function () {
    // Captura o parâmetro de busca na URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const searchQuery = getQueryParam('q');

    if (searchQuery) {
        // Exibe termo pesquisado
        $('#resultadoPesquisa h2').text(`Resultados para: "${searchQuery}"`);

        // Realiza a busca no Firestore
        if (typeof db !== 'undefined') {
            db.collection('artigos')
                .where('keywords', 'array-contains', searchQuery.toLowerCase()) // Exemplo de filtro
                .get()
                .then((querySnapshot) => {
                    const artigosContainer = $('#artigosContainer');
                    artigosContainer.empty();

                    if (querySnapshot.empty) {
                        artigosContainer.append('<p>Nenhum artigo encontrado para o termo pesquisado.</p>');
                    } else {
                        querySnapshot.forEach((doc) => {
                            const artigo = doc.data();
                            artigosContainer.append(`
                                <div class="artigo" data-id="${doc.id}">
                                    <h3>${artigo.titulo}</h3>
                                    <p>${artigo.conteudo.substring(0, 150)}...</p>
                                    <a href="detalhes-artigos.html?id=${doc.id}" class="btn-default">Leia mais</a>
                                </div>
                            `);
                        });
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar artigos:', error);
                });
        } else {
            console.error('Firestore não disponível.');
        }
    } else {
        $('#resultadoPesquisa h2').text('Por favor, insira um termo para pesquisa.');
    }
});

// Submenu
firebase.auth().onAuthStateChanged((user) => {
    const loginNavItem = document.getElementById('loginNavItem');
    const loginLink = loginNavItem.querySelector('a');

    if (user) {
        const userId = user.uid;
        const db = firebase.firestore();
        loginLink.textContent = user.displayName || user.email.split('@')[0];
        loginLink.href = "#";

        // Cria o submenu
        const subMenu = document.createElement('ul');
        subMenu.className = 'submenu';

        // Adiciona "Editar Perfil"
        const editProfileItem = document.createElement('li');
        editProfileItem.innerHTML = `<a href="editar-perfil.html">Editar Perfil</a>`;
        subMenu.appendChild(editProfileItem);

        // Busca perfis das crianças no Firestore
        db.collection('usuarios')
            .doc(userId)
            .collection('childrenProfiles')
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const childProfile = doc.data();
                        const childId = doc.id;

                        // Cria itens do submenu para cada criança
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <a href="editar-perfil-crianca.html?id=${childId}">
                                ${childProfile.name} (${childProfile.age} anos)
                            </a>
                        `;
                        subMenu.appendChild(listItem);
                    });

                    // Adiciona "Recomendações" ao submenu
                    const recommendationsItem = document.createElement('li');
                    recommendationsItem.innerHTML = `
                        <a href="recomendacoes.html">Recomendações para Você</a>
                    `;
                    subMenu.appendChild(recommendationsItem);
                } else {
                    // Caso nenhum perfil de criança exista, exibe opção para criar
                    const noChildProfile = document.createElement('li');
                    noChildProfile.innerHTML = `
                        <a href="perfil-crianca.html">Criar Perfil da Criança</a>
                    `;
                    subMenu.appendChild(noChildProfile);
                }

                // Adiciona logout
                const logoutItem = document.createElement('li');
                logoutItem.innerHTML = '<a href="#" id="logoutButton">Logout</a>';
                subMenu.appendChild(logoutItem);

                document.getElementById('logoutButton').addEventListener('click', () => {
                    firebase.auth().signOut().then(() => {
                        alert('Você saiu.');
                        window.location.href = 'index.html';
                    });
                });
            })
            .catch((error) => {
                console.error('Erro ao carregar perfis de crianças:', error);
            });

        // Anexa o submenu ao item de login
        loginNavItem.appendChild(subMenu);

        // Exibe e oculta o submenu
        loginNavItem.addEventListener('mouseenter', () => {
            subMenu.style.display = 'block';
        });
        loginNavItem.addEventListener('mouseleave', () => {
            subMenu.style.display = 'none';
        });
    } else {
        loginLink.textContent = "Login";
        loginLink.href = "login.html";
    }
});

