// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {collection, addDoc, getFirestore,onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {getAuth ,signInWithEmailAndPassword,onAuthStateChanged,signOut    } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJjBPDt5k4EWdXxu-WQN8vNl9PkbNlII0",
  authDomain: "simple-gastos.firebaseapp.com",
  projectId: "simple-gastos",
  storageBucket: "simple-gastos.appspot.com",
  messagingSenderId: "546481113397",
  appId: "1:546481113397:web:5727bea3d202030f21e47c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const login = (email,password) => signInWithEmailAndPassword(auth, email, password)
const logout = () => signOut(auth)

const addMovimiento = (movimiento) => addDoc(collection(db, "movimientos"), movimiento);

const onGetMovimientos = (callback) => onSnapshot(collection(db,'movimientos'),callback)

const listaMovimientos = document.getElementById('listaMovimientos')
const formLogin = document.getElementById('formLogin')
const formMovimiento = document.getElementById('formMovimiento')
const btnLogout = document.getElementById('btnLogout')
const collapseLista = document.getElementById('collapseLista')
const loginTags = document.querySelectorAll('.login')
const logoutTags = document.querySelectorAll('.logout')

let userUid = ''

window.addEventListener('DOMContentLoaded', async() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginTags.forEach(tag => tag.style.display = 'block')
            logoutTags.forEach(tag => tag.style.display = 'none')
            document.getElementById('userLogeado').innerHTML = user.email
            userUid = user.uid;
            onGetMovimientos((querySnapshot)=>{
                listaMovimientos.innerHTML = ''
                querySnapshot.forEach((doc) => {

                    if(doc.data().userUid === userUid)
                        listaMovimientos.innerHTML += `
                        <td>
                            ${doc.data().fecha}
                        </td>
                        <td>
                            ${doc.data().categoria}
                        </td>
                        <td>
                            ${doc.data().nombre}
                        </td>
                        <td>
                            ${doc.data().monto}
                        </td>
                        `
                });
            })
          // ...
        } else {
            loginTags.forEach(tag => tag.style.display = 'none')
            logoutTags.forEach(tag => tag.style.display = 'block')
            document.getElementById('userLogeado').innerHTML = 'Bienvenido'
        }
      });
});

formLogin.addEventListener('submit',(e) => {
    e.preventDefault()
    const email = formLogin['inpEmail'].value
    const pass = formLogin['inpPass'].value

    login(email,pass)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            document.getElementById('userLogeado').innerHTML = user.email
            loginTags.forEach(tag => tag.style.display = 'block')
            logoutTags.forEach(tag => tag.style.display = 'none')
            collapseLista.className = 'collapse show'
            // ...
        })
        .catch((error) => {
            console.log(error.code,error.message)
        });
})

btnLogout.addEventListener('click',(e) =>{
    logout()
        .then(() => {
            loginTags.forEach(tag => tag.style.display = 'none')
            logoutTags.forEach(tag => tag.style.display = 'block')
            document.getElementById('userLogeado').innerHTML = 'Bienvenido'
            listaMovimientos.innerHTML = ''
        }).catch((error) => {
            console.log(error.code,error.message)
        });
})

formMovimiento.addEventListener('submit',(e) => {
    e.preventDefault()
    const fecha = formMovimiento['inpFecha'].value
    const nombre = formMovimiento['inpNombre'].value
    const monto = formMovimiento['inpMonto'].value
    const categoria = formMovimiento['inpCategoria'].value
    console.log(fecha,categoria,nombre,monto,userUid)

    addMovimiento({
        fecha,
        categoria,
        nombre,
        monto,
        userUid
      })
})
