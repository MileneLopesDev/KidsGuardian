// Menu
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Tela inicial
let prevButton = document.getElementById('prev');
let nextButton = document.getElementById('next');
let slides = document.querySelector('.slides');
let items = slides.querySelectorAll('.list .item');
let indicator = document.querySelector('.indicators');
let dots = indicator.querySelectorAll('ul li');

let activeIndex = 0;
let firstPosition = 0;
let lastPosition = items.length - 1;

function updateActiveItem(index) {
    slides.querySelector('.list .item.active').classList.remove('active');
    dots[activeIndex].classList.remove('active');

    activeIndex = index;

    items[activeIndex].classList.add('active');
    dots[activeIndex].classList.add('active');

    document.querySelector('.number').textContent = `0${activeIndex + 1}`;
}

// Botão anterior
prevButton.onclick = () => {
    let newIndex = activeIndex - 1 < firstPosition ? lastPosition : activeIndex - 1;
    updateActiveItem(newIndex);
};

// Botão próximo
nextButton.onclick = () => {
    let newIndex = activeIndex + 1 > lastPosition ? firstPosition : activeIndex + 1;
    updateActiveItem(newIndex);
};


// Verificar se o usuário está logado e ajustar o menu
firebase.auth().onAuthStateChanged(function (user) {
    var userNav = document.getElementById('user-nav');
    var navLinks = document.getElementById('nav-links');

    if (user) {
        var userName = user.displayName ? user.displayName : user.email;


        // Exibir dropdown para logout
        userNav.innerHTML = `
            <div class="dropdown">
                <a href="#" class="user-name">${userName}</a>
                <div class="dropdown-content">
                    <a href="atualizar.html">Atualizar Cadastro</a>
                    <a href="#" id="logout">Sair</a>
                </div>
            </div>
        `;

        // Função de logout
        document.getElementById('logout').addEventListener('click', function () {
            firebase.auth().signOut().then(() => {
                alert('Você saiu com sucesso.');
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error('Erro ao sair:', error);
            });
        });
    } else {
        userNav.innerHTML = '<a href="login.html">Login</a>';
    }
});

// Função buscar relatórios
function renderizarRelatorio(data, docId) {
    return `
        <div class="relatorio">
            <h3><a href="detalhes-relatorio.html?id=${docId}">${data.titulo}</a></h3>
            <p><strong>Idade:</strong> ${data.idade}</p>
            <p>${data.conteudo.substring(0, 100)}...</p>
        </div>
    `;
}

// Função carregar relatórios
function carregarRelatorios() {
    var resultado = document.getElementById('resultado');
    resultado.innerHTML = 'Carregando...';

    db.collection("relatorios").get().then((querySnapshot) => {
        resultado.innerHTML = '';
        if (querySnapshot.empty) {
            resultado.innerHTML = 'Nenhum relatório encontrado.';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                if (Array.isArray(data.idade)) {
                    resultado.innerHTML += renderizarRelatorio(data, docId);
                }
            });
        }
    }).catch((error) => {
        console.error("Erro ao buscar relatórios: ", error);
        resultado.innerHTML = 'Erro ao buscar relatórios.';
    });
}

// Função buscar relatórios por idade
document.getElementById('buscarRelatorio').addEventListener('click', function () {
    var idade = parseInt(document.getElementById('idade').value);
    var resultado = document.getElementById('resultado');
    resultado.innerHTML = 'Carregando...';

    db.collection("relatorios").where("idade", "array-contains", idade).get()
        .then((querySnapshot) => {
            resultado.innerHTML = '';
            if (querySnapshot.empty) {
                resultado.innerHTML = 'Nenhum relatório encontrado para essa idade.';
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const docId = doc.id;
                    resultado.innerHTML += renderizarRelatorio(data, docId);
                });
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar relatórios: ", error);
            resultado.innerHTML = 'Erro ao buscar relatórios.';
        });
});
