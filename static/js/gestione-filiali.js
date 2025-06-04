let filialiGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('searchbar');
    const table = document.getElementById('branchesTable');

    const corpoTabella = document.getElementById('branchesBody');
    corpoTabella.addEventListener('click', (e) => {
        const target = e.target.closest('button');

        if (!target) return;

        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-remove')) {
            if (confirm('Vuoi davvero rimuovere questa filiale?')) {
                rimuoviFiliale(id);
            }
        }

        if (target.classList.contains('btn-edit')) {
            const filiale = filialiGlobali.find(f => f.id == id);
            if (filiale) openModal('Modifica filiale', filiale);
        }
    });


    const btnAggiungi = document.getElementById('btnAggiungi');
    const btnAlpDec = document.getElementById('alpDec');
    const btnAlpAsc = document.getElementById('alpAsc');

    const modal = document.getElementById('branchModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.querySelector('.modal .close');

    const inputId = document.getElementById('branchId');
    const inputNome = document.getElementById('branchName');
    const inputCitta = document.getElementById('branchCity');
    const inputPaese = document.getElementById('branchCountry');

    const formBranch = document.getElementById('branchForm');

    function caricaFiliali() {
        fetch('/supermercato-gestionale/core/filiali.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Errore nel caricamento delle filiali: ' + data.error);
                    return;
                }
                filialiGlobali = data;
                popolaTabella(filialiGlobali);
            })
            .catch(err => alert('Errore di rete: ' + err));
    }

    function popolaTabella(filiali) {
        corpoTabella.innerHTML = '';

        filiali.forEach(filiale => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${filiale.nome}</td>
                <td>${filiale.citta}</td>
                <td>${filiale.paese}</td>
                <td>
                    <div class="btn-group">
                    <button class="btn-edit" data-id="${filiale.id}">Modifica <i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-remove" data-id="${filiale.id}">Rimuovi <i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            corpoTabella.appendChild(tr);
        });
    }

    function aggiungiFiliale(e) { // Funzione di aggiunta filiale

        e.preventDefault();

        const nome = document.getElementById('branchName').value.trim();
        const citta = document.getElementById('branchCity').value.trim();
        const paese = document.getElementById('branchCountry').value.trim();

        if (!nome || !citta || !paese) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { nome, citta, paese }; // Creo il payload da inviare al PHP

        fetch('/supermercato-gestionale/controllers/branches/filiale-aggiungi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Filiale aggiunta con successo');
                    formBranch.reset();
                    closeModal();
                    caricaFiliali(); // Ricarica la tabella aggiornata
                } else {
                    alert('Errore nel aggiunta della filiale: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    };

    function modificaFiliale(e) { // Funzione modifica filiale, stesso di aggiunta ma con ID - Funzione separata per chiarezza
        e.preventDefault();

        const id = inputId.value.trim();
        const nome = inputNome.value.trim();
        const citta = inputCitta.value.trim();
        const paese = inputPaese.value.trim();

        if (!id || !nome || !citta || !paese) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { id, nome, citta, paese };

        fetch('/supermercato-gestionale/controllers/branches/filiale-modifica.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Filiale modificata con successo');
                    formBranch.reset();
                    closeModal();
                    caricaFiliali(); // Ricarica la tabella aggiornata
                } else {
                    alert('Errore nella modifica della filiale: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function rimuoviFiliale(id) { // Funzione di rimozione filiale
        fetch('/supermercato-gestionale/controllers/branches/filiale-rimuovi.php', { // Fetch al file PHP
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json()) // Risposta in formato JSON per leggerne il risultato
            .then(data => {
                if (data.success) {
                    alert('Filiale rimossa con successo!');
                    closeModal();
                    caricaFiliali(); // Ricarica la tabella aggiornata
                } else {
                    alert('Errore nella rimozione della filiale: ' + data.error); // Mostra l'errore in caso di fallimento
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function openModal(titolo, filiale = null) {
        modalTitle.textContent = titolo;

        if (filiale) {
            inputId.value = filiale.id;
            inputNome.value = filiale.nome;
            inputCitta.value = filiale.citta;
            inputPaese.value = filiale.paese;
        } else {
            inputId.value = '';
            inputNome.value = '';
            inputCitta.value = '';
            inputPaese.value = '';
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

    function filtraFiliali() {
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
        const sorted = [...filialiGlobali].sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();

            return asc ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
        });

        popolaTabella(sorted);
    }

    searchbar.addEventListener('keyup', filtraFiliali);
    btnAlpAsc.addEventListener('click', () => ordinaTabella(false));  // A->Z
    btnAlpDec.addEventListener('click', () => ordinaTabella(true)); // Z->A
    btnAggiungi.addEventListener('click', () => openModal('Aggiungi nuova filiale'));

    if (formBranch) {
        formBranch.addEventListener('submit', (e) => {
            if (inputId.value) {
                modificaFiliale(e); // Se c'è un ID, modifica la filiale
            } else {
                aggiungiFiliale(e); // Altrimenti, aggiungi una nuova filiale
            }
        });
    }

    caricaFiliali();
});
