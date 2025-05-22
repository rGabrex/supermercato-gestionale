let filialiGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('searchbar');
    const table = document.getElementById('branchesTable');
    const corpoTabella = document.getElementById('branchesBody');

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

        attachButtonEvents();
    }

    function attachButtonEvents() {
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (!confirm("Sei sicuro di voler eliminare questa filiale? Marinella Lodon sarà una lagna senza fine!")) return;

                fetch('/supermercato-gestionale/management/rimuovi-filiali.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert('Filiale rimossa! Marinella Lodon tira un sospiro di sollievo.');
                            caricaFiliali();
                        } else {
                            alert('Errore nella rimozione: ' + data.error);
                        }
                    })
                    .catch(err => alert('Errore di rete: ' + err));
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const filiale = filialiGlobali.find(f => f.id == id);
                if (!filiale) {
                    alert("Filiale non trovata, Marinella Lodon si incazza!");
                    return;
                }
                openModal('Modifica Filiale', filiale);
            });
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

    formBranch.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = inputId.value;
        const nome = inputNome.value.trim();
        const citta = inputCitta.value.trim();
        const paese = inputPaese.value.trim();

        if (!nome || !citta || !paese) {
            alert('Completa tutti i campi, Marinella Lodon non gradisce mezze misure!');
            return;
        }

        const url = id ? '/supermercato-gestionale/management/modifica-filiali.php' : '/supermercato-gestionale/management/aggiungi-filiali.php';

        const payload = id ? { id: parseInt(id), nome, citta, paese } : { nome, citta, paese };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                console.log('Response status:', res.status);
                return res.json();
            })
            .then(data => {
                console.log('Risposta PHP:', data);
                if (data.success) {
                    alert(id ? 'Filiale modificata con successo, Marinella Lodon è soddisfatta!' : 'Filiale aggiunta, festeggiamo!');
                    closeModal();
                    caricaFiliali();
                } else {
                    alert('Errore nel salvataggio: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete o parsing:', err);
                alert('Errore di rete o parsing: ' + err);
            });

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

    caricaFiliali();
});
