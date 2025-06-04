let clientiGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('searchbar');
    const table = document.getElementById('clientsTable');

    const corpoTabella = document.getElementById('clientsBody');
    corpoTabella.addEventListener('click', (e) => {
        const target = e.target.closest('button');

        if (!target) return;

        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-remove')) {
            if (confirm('Vuoi davvero rimuovere questo cliente?')) {
                rimuoviCliente(id);
            }
        }

        if (target.classList.contains('btn-edit')) {
            const cliente = clientiGlobali.find(c => c.id == id);
            if (cliente) openModal('Modifica cliente', cliente);
        }
    });

    const btnAggiungi = document.getElementById('btnAggiungi');
    const btnAlpDec = document.getElementById('alpDec');
    const btnAlpAsc = document.getElementById('alpAsc');

    const modal = document.getElementById('clientModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.querySelector('.modal .close');

    const inputId = document.getElementById('clientId');
    const inputNome = document.getElementById('clientName');
    const inputCognome = document.getElementById('clientSurname');
    const inputEmail = document.getElementById('clientEmail');
    const inputDataNascita = document.getElementById('clientBirthdate');

    const formClient = document.getElementById('clientForm');

    function caricaClienti() {
        fetch('/supermercato-gestionale/core/clienti.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Errore nel caricamento dei clienti: ' + data.error);
                    return;
                }
                clientiGlobali = data;
                popolaTabella(clientiGlobali);
                aggiornaContatore();
            })
            .catch(err => alert('Errore di rete: ' + err));
    }

    function popolaTabella(clienti) {
        corpoTabella.innerHTML = '';

        clienti.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.cognome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.data_nascita}</td>
                <td>
                    <div class="btn-group">
                    <button class="btn-edit" data-id="${cliente.id}">Modifica <i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-remove" data-id="${cliente.id}">Rimuovi <i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            corpoTabella.appendChild(row);
        });
    }

    function aggiungiCliente(e) {

        e.preventDefault();

        const nome = document.getElementById('clientName').value.trim();
        const cognome = document.getElementById('clientSurname').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const dataNascita = document.getElementById('clientBirthdate').value.trim();

        if (!nome || !cognome || !email || !dataNascita) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { nome, cognome, email, dataNascita };

        fetch('/supermercato-gestionale/controllers/customers/cliente-aggiungi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Cliente aggiunto con successo');
                    formClient.reset();
                    closeModal();
                    caricaClienti();
                } else {
                    alert('Errore nel aggiunta del cliente: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    };

    function modificaCliente(e) {
        e.preventDefault();

        const id = inputId.value.trim();
        const nome = inputNome.value.trim();
        const cognome = inputCognome.value.trim();
        const email = inputEmail.value.trim();
        const dataNascita = inputDataNascita.value.trim();

        if (!id || !nome || !cognome || !email || !dataNascita) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { id, nome, cognome, email, dataNascita };

        fetch('/supermercato-gestionale/controllers/customers/cliente-modifica.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Cliente modificato con successo');
                    formClient.reset();
                    closeModal();
                    caricaClienti();
                } else {
                    alert('Errore nella modifica del Cliente: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function rimuoviCliente(id) {
        fetch('/supermercato-gestionale/controllers/customers/cliente-rimuovi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Cliente rimosso con successo!');
                    closeModal();
                    caricaClienti();
                } else {
                    alert('Errore nella rimozione del cliente: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function openModal(titolo, cliente = null) {
        modalTitle.textContent = titolo;

        if (cliente) {
            inputId.value = cliente.id;
            inputNome.value = cliente.nome;
            inputCognome.value = cliente.cognome;
            inputEmail.value = cliente.email;
            inputDataNascita.value = cliente.data_nascita;
        } else {
            inputId.value = '';
            inputNome.value = '';
            inputCognome.value = '';
            inputEmail.value = '';
            inputDataNascita.value = '';
        }

        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function aggiornaContatore() {
        const totalClients = document.getElementById('totalClients');
        if (totalClients) {
            totalClients.textContent = clientiGlobali.length;
        }
    }


    function filtraClienti() {
        const filter = searchbar.value.toUpperCase();
        const righe = table.getElementsByTagName('tr');

        for (let i = 1; i < righe.length; i++) {
            const tdNome = righe[i].getElementsByTagName('td')[0];
            if (tdNome) {
                const testo = tdNome.textContent || tdNome.innerText;
                righe[i].style.display = testo.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
            }
        }
    }

    function ordinaTabella(asc) {
        const sorted = [...clientiGlobali].sort((a, b) => {
            const cognomeA = a.cognome.toLowerCase();
            const cognomeB = b.cognome.toLowerCase();

            return asc ? cognomeA.localeCompare(cognomeB) : cognomeB.localeCompare(cognomeA);
        });

        popolaTabella(sorted);
    }

    searchbar.addEventListener('keyup', filtraClienti);
    btnAlpAsc.addEventListener('click', () => ordinaTabella(false));  // A->Z
    btnAlpDec.addEventListener('click', () => ordinaTabella(true)); // Z->A
    btnAggiungi.addEventListener('click', () => openModal('Aggiungi nuovo cliente'));

    if (formClient) {
        formClient.addEventListener('submit', (e) => {
            if (inputId.value) {
                modificaCliente(e); // Se c'è un ID, modifica la Cliente
            } else {
                aggiungiCliente(e); // Altrimenti, aggiungi una nuova Cliente
            }
        });
    }

    caricaClienti();
});