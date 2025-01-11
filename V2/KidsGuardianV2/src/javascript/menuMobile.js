firebase.auth().onAuthStateChanged((user) => {
    const mobileLoginNavItem = document.getElementById("mobile_loginNavItem");
    const mobileLoginLink = mobileLoginNavItem.querySelector("a");
    const mobileParaVoceTab = document.getElementById("mobile_paraVoceTab");
    const mobileRecursosEducacionais = document.getElementById("mobile_recursosEducacionais");
    // Elementos do menu mobile
    const mobileSearchButton = document.getElementById("mobile_searchButton");
    const mobileSearchQuery = document.getElementById("mobile_searchQuery");

    if (user) {
        const userId = user.uid;
        const db = firebase.firestore();
        const userName = user.displayName || user.email.split("@")[0];
        mobileLoginLink.textContent = userName;
        mobileLoginLink.href = "#";

        // Submenu para login
        const mobileSubMenu = document.createElement("ul");
        mobileSubMenu.className = "submenu";

        // Adicionar editar perfil
        const editProfileItem = document.createElement("li");
        editProfileItem.innerHTML = `<a href="editar-perfil.html">Editar Perfil</a>`;
        mobileSubMenu.appendChild(editProfileItem);

        db.collection("usuarios").doc(userId).get().then((doc) => {
            const userData = doc.data();
            const userType = userData?.categorias?.[0];

            if (userType === "Responsável") {
                // Mostrar aba "Para Você"
                mobileParaVoceTab.style.display = "block";

                // Adicionar perfil de crianças
                db.collection("usuarios").doc(userId).collection("childrenProfiles").get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((childDoc) => {
                            const child = childDoc.data();
                            const childItem = document.createElement("li");
                            childItem.innerHTML = `<a href="editar-perfil-crianca.html?id=${childDoc.id}">${child.name} (${child.age} anos)</a>`;
                            mobileSubMenu.appendChild(childItem);
                        });
                    });
            } else if (userType === "Educador") {
                // Mostrar recursos educacionais
                mobileRecursosEducacionais.style.display = "block";

                // Adicionar submenu de faixas etárias
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

                mobileRecursosEducacionais.appendChild(faixaEtariaMenu);
            }
        });

        // Adicionar logout
        const logoutItem = document.createElement("li");
        logoutItem.innerHTML = `<a href="#" id="logoutMobileButton">Logout</a>`;
        mobileSubMenu.appendChild(logoutItem);

        logoutItem.addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                alert("Você saiu.");
                window.location.href = "index.html";
            });
        });

        // Lógica de submenu
        mobileLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            const isVisible = mobileSubMenu.style.display === "block";
            mobileSubMenu.style.display = isVisible ? "none" : "block";
        });

        mobileLoginNavItem.appendChild(mobileSubMenu);
    } else {
        mobileLoginLink.textContent = "Login";
        mobileLoginLink.href = "login.html";

        // Ocultar itens específicos de usuário
        mobileParaVoceTab.style.display = "none";
        mobileRecursosEducacionais.style.display = "none";
    }

    // Lógica para o botão de pesquisa mobile
    if (mobileSearchButton && mobileSearchQuery) {
        mobileSearchButton.addEventListener("click", () => {
            const searchQuery = mobileSearchQuery.value.trim(); // Captura o valor da pesquisa
            if (searchQuery) {
                // Redireciona para a página de resultados com o termo de busca
                window.location.href = `pesquisa.html?q=${encodeURIComponent(searchQuery)}`;
            } else {
                alert("Por favor, insira um termo para pesquisar.");
            }
        });}
});

