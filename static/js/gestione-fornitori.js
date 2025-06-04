let fornitoriGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('searchbar');
    const table = document.getElementById('suppliersTable');

    const corpoTabella = document.getElementById('suppliersBody');
    corpoTabella.addEventListener('click', (e) => {
        const target = e.target.closest('button');

        if (!target) return;

        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-remove')) {
            if (confirm('Vuoi davvero rimuovere questo fornitore?')) {
                rimuoviFornitore(id);
            }
        }

        if (target.classList.contains('btn-edit')) {
            const fornitore = fornitoriGlobali.find(f => f.id == id);
            if (fornitore) openModal('Modifica fornitore', fornitore);
        }
    });


    const btnAggiungi = document.getElementById('btnAggiungi');
    const btnAlpDec = document.getElementById('alpDec');
    const btnAlpAsc = document.getElementById('alpAsc');

    const modal = document.getElementById('supplierModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.querySelector('.modal .close');

    const inputId = document.getElementById('supplierId');
    const inputNome = document.getElementById('supplierName');
    const inputNazione = document.getElementById('supplierNation');

    const formSupplier = document.getElementById('supplierForm');

    function caricaFornitori() {
        fetch('/supermercato-gestionale/core/fornitori.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Errore nel caricamento delle fornitori: ' + data.error);
                    return;
                }
                fornitoriGlobali = data;
                popolaTabella(fornitoriGlobali);
            })
            .catch(err => alert('Errore di rete: ' + err));
    }

    function popolaTabella(fornitori) {
        corpoTabella.innerHTML = '';

        fornitori.forEach(fornitore => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fornitore.nome}</td>
                <td>${fornitore.nazione}</td>
                <td>
                    <div class="btn-group">
                    <button class="btn-edit" data-id="${fornitore.id}">Modifica <i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-remove" data-id="${fornitore.id}">Rimuovi <i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            corpoTabella.appendChild(tr);
        });
    }

    function aggiungiFornitore(e) { // Funzione di aggiunta fornitore

        e.preventDefault();

        const nome = document.getElementById('supplierName').value.trim();
        const nazione = document.getElementById('supplierNation').value.trim();

        if (!nome || !nazione) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { nome, nazione }; // Creo il payload da inviare al PHP

        fetch('/supermercato-gestionale/controllers/suppliers/fornitore-aggiungi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Fornitore aggiunto con successo');
                    formSupplier.reset();
                    closeModal();
                    caricaFornitori(); // Ricarica la tabella aggiornata
                } else {
                    alert('Errore nel aggiunta del fornitore: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    };

    function modificaFornitore(e) { // Funzione modifica fornitore, stesso di aggiunta ma con ID - Funzione separata per chiarezza
        e.preventDefault();

        const id = inputId.value.trim();
        const nome = inputNome.value.trim();
        const nazione = inputNazione.value.trim();

        if (!id || !nome || !nazione) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { id, nome, nazione };

        fetch('/supermercato-gestionale/controllers/suppliers/fornitore-modifica.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Fornitore modificato con successo');
                    formSupplier.reset();
                    closeModal();
                    caricaFornitori(); // Ricarica la tabella aggiornata
                } else {
                    alert('Errore nella modifica del fornitore: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function rimuoviFornitore(id) { // Funzione di rimozione fornitore
        fetch('/supermercato-gestionale/controllers/suppliers/fornitore-rimuovi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json()) // Risposta in formato JSON per leggerne il risultato
            .then(data => {
                if (data.success) {
                    alert('Fornitore rimosso con successo!');
                    closeModal();
                    caricaFornitori(); // Ricarica la tabella aggiornata
                } else {
                    alert('Errore nella rimozione della fornitore: ' + data.error); // Mostra l'errore in caso di fallimento
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function openModal(titolo, fornitore = null) {
        console.log('Classi:', modal.classList);
        modalTitle.textContent = titolo;

        if (fornitore) {
            inputId.value = fornitore.id;
            inputNome.value = fornitore.nome;
            inputNazione.value = fornitore.nazione;
        } else {
            inputId.value = '';
            inputNome.value = '';
            inputNazione.value = '';
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

    function filtraFornitori() {
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
        const sorted = [...fornitoriGlobali].sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();

            return asc ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
        });

        popolaTabella(sorted);
    }

    searchbar.addEventListener('keyup', filtraFornitori);
    btnAlpAsc.addEventListener('click', () => ordinaTabella(false));  // A->Z
    btnAlpDec.addEventListener('click', () => ordinaTabella(true)); // Z->A
    btnAggiungi.addEventListener('click', () => openModal('Aggiungi nuova fornitore'));

    if (formSupplier) {
        formSupplier.addEventListener('submit', (e) => {
            if (inputId.value) {
                modificaFornitore(e); // Se c'è un ID, modifica la fornitore
            } else {
                aggiungiFornitore(e); // Altrimenti, aggiungi una nuova fornitore
            }
        });
    }

    caricaFornitori();
});
