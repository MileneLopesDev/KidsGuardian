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
                                    <p><strong>Idades:</strong> ${artigo.idade.join(', ')}</p>
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

document.addEventListener("DOMContentLoaded", () => {
    if (!firebase || !firebase.auth || !firebase.firestore) {
        console.error("Firebase não foi inicializado corretamente.");
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        const loginNavItem = document.getElementById("loginNavItem");
        const loginLink = loginNavItem.querySelector("a");
        const paraVoceTab = document.getElementById("paraVoceTab");
        const controlesParentais = document.getElementById("controlesParentais");

        if (user) {
            const userId = user.uid;
            const db = firebase.firestore();

            // Atualizar nome do usuário
            const userName = user.displayName || user.email.split("@")[0];
            loginLink.textContent = userName;
            loginLink.href = "#";

            // Criar submenu
            const subMenu = document.createElement("ul");
            subMenu.className = "submenu";

            db.collection("usuarios").doc(userId).get()
                .then((doc) => {
                    if (!doc.exists) {
                        console.error(`Documento de usuário com ID '${userId}' não encontrado.`);
                        return; // Parar a execução se o documento não existir
                    }

                    const userData = doc.data();
                    const userType = userData?.categorias?.[0]; // Responsável ou Educador

                    // Adicionar "Editar Perfil"
                    const editProfileItem = document.createElement("li");
                    editProfileItem.innerHTML = `<a href="editar-perfil.html">Editar Perfil</a>`;
                    subMenu.appendChild(editProfileItem);

                    if (userType === "Responsável") {
                        // Adicionar opções relacionadas à criança
                        const createChildProfileItem = document.createElement("li");
                        createChildProfileItem.innerHTML = `<a href="perfil-crianca.html">Criar Perfil da Criança</a>`;
                        subMenu.appendChild(createChildProfileItem);

                        db.collection("usuarios").doc(userId).collection("childrenProfiles").get()
                            .then((querySnapshot) => {
                                if (querySnapshot.empty) {
                                    console.log("Nenhum perfil de criança encontrado.");
                                } else {
                                    querySnapshot.forEach((childDoc) => {
                                        const child = childDoc.data();
                                        const childItem = document.createElement("li");
                                        childItem.innerHTML = `<a href="editar-perfil-crianca.html?id=${childDoc.id}">${child.name} (${child.age} anos)</a>`;
                                        subMenu.appendChild(childItem);
                                    });
                                }

                                
                                loginNavItem.appendChild(subMenu);
                            })
                            .catch((error) => {
                                console.error("Erro ao carregar perfis de crianças:", error);
                            });

                        // Mostrar a aba "Para Você"
                        paraVoceTab.style.display = "block";
                        paraVoceTab.innerHTML = `<a href="para-voce.html">Para Você</a>`;
                    } else if (userType === "Educador") {
                        // Substituir "Controles Parentais" por "Recursos Educacionais"
                        if (controlesParentais) {
                            const recursosEducacionaisItem = document.createElement("li");
                            recursosEducacionaisItem.className = "nav-item";
                            recursosEducacionaisItem.id = "recursosEducacionais";
                            recursosEducacionaisItem.innerHTML = `<a href="#">Recursos Educacionais</a>`;

                            const faixaEtariaMenu = document.createElement("ul");
                            faixaEtariaMenu.classList.add("submenu");

                            const faixasEtarias = [
                                { idade: "0-2", titulo: "Bebês (0-2 anos)" },
                                { idade: "3-5", titulo: "Crianças (3-5 anos)" },
                                { idade: "6-10", titulo: "Crianças (6-10 anos)" },
                                { idade: "11-18", titulo: "Adolescentes (11-18 anos)" },
                            ];

                            faixasEtarias.forEach((faixa) => {
                                const faixaItem = document.createElement("li");
                                faixaItem.innerHTML = `<a href="recursosEducacionais.html?idade=${faixa.idade}">${faixa.titulo}</a>`;
                                faixaEtariaMenu.appendChild(faixaItem);
                            });

                            recursosEducacionaisItem.appendChild(faixaEtariaMenu);

                            // Substituir o elemento "controlesParentais"
                            controlesParentais.replaceWith(recursosEducacionaisItem);
                        }

                        // ocultar "Para Você"
                        if (paraVoceTab) {
                            paraVoceTab.style.display = "none";
                        }
                    } else {
                        console.error("Tipo de usuário não reconhecido.");
                    }

                    // Adicionar logout no final do submenu
                    appendLogout(subMenu);
                    loginNavItem.appendChild(subMenu);
                })
                .catch((error) => {
                    console.error("Erro ao buscar dados do usuário:", error);
                });
        } else {
            // Usuário não autenticado
            paraVoceTab.style.display = "none";
            loginLink.textContent = "Login";
            loginLink.href = "login.html";
        }
    });

    // Função para adicionar logout
    function appendLogout(subMenu) {
        const logoutItem = document.createElement("li");
        logoutItem.innerHTML = `<a href="#" id="logoutButton">Logout</a>`;
        subMenu.appendChild(logoutItem);

        logoutItem.addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                alert("Você saiu.");
                window.location.href = "index.html";
            });
        });
    }
});
