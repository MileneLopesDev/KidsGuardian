firebase.auth().onAuthStateChanged((user) => {
    const mobileLoginNavItem = document.getElementById("mobile_loginNavItem");
    const mobileLoginLink = mobileLoginNavItem.querySelector("a");

    if (user) {
        const userId = user.uid;
        const db = firebase.firestore();
        const userName = user.displayName || user.email.split("@")[0];
        mobileLoginLink.textContent = userName;
        mobileLoginLink.href = "#";

        // Criar submenu para o mobile
        const mobileSubMenu = document.createElement("ul");
        mobileSubMenu.className = "submenu";

        // Adicionar "Editar Perfil"
        const editProfileItem = document.createElement("li");
        editProfileItem.innerHTML = `<a href="editar-perfil.html">Editar Perfil</a>`;
        mobileSubMenu.appendChild(editProfileItem);

        // Carregar crianças cadastradas
        db.collection("usuarios").doc(userId).collection("childrenProfiles").get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("Nenhum perfil de criança encontrado.");
                } else {
                    querySnapshot.forEach((childDoc) => {
                        const child = childDoc.data();
                        const childItem = document.createElement("li");
                        childItem.innerHTML = `<a href="editar-perfil-crianca.html?id=${childDoc.id}">${child.name} (${child.age} anos)</a>`;
                        mobileSubMenu.appendChild(childItem);
                    });
                }

                // Adicionar logout ao final
                const logoutItem = document.createElement("li");
                logoutItem.innerHTML = `<a href="#" id="logoutMobileButton">Logout</a>`;
                mobileSubMenu.appendChild(logoutItem);

                // Logout no mobile
                logoutItem.addEventListener("click", () => {
                    firebase.auth().signOut().then(() => {
                        alert("Você saiu.");
                        window.location.href = "index.html";
                    });
                });

                // Adicionar submenu ao item de login no mobile
                mobileLoginNavItem.appendChild(mobileSubMenu);

                // Lógica para mostrar/ocultar submenu ao clicar
                let isSubMenuVisible = false;
                mobileLoginLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    isSubMenuVisible = !isSubMenuVisible;
                    mobileSubMenu.style.display = isSubMenuVisible ? "block" : "none";
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar perfis de crianças:", error);
            });
    } else {
        mobileLoginLink.textContent = "Login";
        mobileLoginLink.href = "login.html";
    }
});
