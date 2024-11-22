// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCTEp97EOLY-gLRa6MdnvN7uH6EFBkoIfE",
    authDomain: "guardian-df1b8.firebaseapp.com",
    projectId: "guardian-df1b8",
    storageBucket: "guardian-df1b8.appspot.com",
    messagingSenderId: "336725609307",
    appId: "1:336725609307:web:758967a3b7a607a5d3e87e",
    measurementId: "G-88L4X0FMSG",
  };
  
  // Inicializar Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso.");
  } else {
    console.log("Firebase já estava inicializado.");
  }
  
  // Inicializar Auth e Firestore
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Adicionar Listener para Autenticação (opcional)
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Usuário autenticado:", user);
    } else {
      console.log("Nenhum usuário autenticado.");
    }
  });
  