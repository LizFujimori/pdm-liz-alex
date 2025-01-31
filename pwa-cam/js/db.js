import { openDB } from 'idb'

let db

window.addEventListener('DOMContentLoaded', async event => {
    createDB()
    document.getElementById('input')
    document.getElementById('btnSalvar').addEventListener('click', addData)
    document.getElementById('btnListar').addEventListener('click', getData)
    document.getElementById('btnAlterar').addEventListener('click', putData)
    document.getElementById('btnExcluir').addEventListener('click', deleteData)
})

async function addData() {
    let treino = document.getElementById('treino').value
    let carga = document.getElementById('carga').value
    const tx = await db.transaction('treinos', 'readwrite')
    const store = tx.objectStore('treinos')
    store.add({ treino: treino, carga: carga })
    await tx.done
    limparCampos()
}

async function getData() {
    if (db == undefined) {
        showResult('O banco de dados está fechado')
        return
    }

    const tx = await db.transaction('treinos', 'readonly')
    const store = tx.objectStore('treinos')
    const value = await store.getAll()
    if (value) {
        const listagem = value.map(treino => {
            return `<div>
            <p> ${treino.treino} </p>
            <p> ${treino.carga} </p>
            </div>`
        })
        showResult('Dados do banco: ' + listagem.join(''))
    } else {
        showResult('Não há nenhum dado no banco.')
    }
}

async function putData() {
    const tx = await db.transaction('treinos', 'readwrite')
    const store = tx.objectStore('treinos')
    let treino = store.get(treino)
    store.put(obj)
}

async function deleteData() {
    let obj = getData()
    if (obj) {
        const tx = await db.transaction('treinos', 'readwrite')
        const store = tx.objectStore('treinos')
        store.delete(obj)
    }
}

function showResult(text) {
    document.querySelector('output').innerHTML = text
}

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('treinos', {
                            keyPath: 'treino'
                        })
                        store.createIndex('id', 'id')
                        showResult('Banco de dados criado.')
                }
            }
        })
        showResult('Banco de dados aberto.')
    } catch (e) {
        showResult('Erro ao criar o banco de dados: ' + e.message)
    }
}

function limparCampos() {
    document.getElementById('treino').value = ''
    document.getElementById('carga').value = ''
}