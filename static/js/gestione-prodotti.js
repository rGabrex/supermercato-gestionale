let prodottiGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('searchbar');
    const table = document.getElementById('productsTable');

    const corpoTabella = document.getElementById('productsBody');
    corpoTabella.addEventListener('click', (e) => {
        const target = e.target.closest('button');

        if (!target) return;

        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-remove')) {
            if (confirm('Vuoi davvero rimuovere questo prodotto?')) {
                rimuoviProdotto(id);
            }
        }

        if (target.classList.contains('btn-edit')) {
            const prodotto = prodottiGlobali.find(p => p.id == id);
            if (prodotto) openModal('Modifica prodotto', prodotto);
        }
    });

    const btnAggiungi = document.getElementById('btnAggiungi');
    const btnAlpDec = document.getElementById('alpDec');
    const btnAlpAsc = document.getElementById('alpAsc');

    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.querySelector('.modal .close');

    const inputId = document.getElementById('productId');
    const inputNome = document.getElementById('productName');
    const inputCodice = document.getElementById('productCode');
    const inputCategoria = document.getElementById('productCategory');
    const inputPrezzo = document.getElementById('productPrice');
    const inputQuantita = document.getElementById('productStock');

    const formProduct = document.getElementById('productForm');

    function caricaProdotti() {
        fetch('/supermercato-gestionale/core/prodotti.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Errore nel caricamento dei prodotti: ' + data.error);
                    return;
                }
                prodottiGlobali = data;
                popolaTabella(prodottiGlobali);
                aggiornaContatore();
            })
            .catch(err => alert('Errore di rete: ' + err));
    }

    function popolaTabella(prodotti) {
        corpoTabella.innerHTML = '';

        prodotti.forEach(prodotto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prodotto.nome}</td>
                <td>${prodotto.codice || '-'}</td>
                <td>${prodotto.giacenza}</td>
                <td>${prodotto.prezzo}</td>
                <td>${prodotto.categoria || '-'}</td>
                <td>${prodotto.nome_fornitore || '-'}</td>
                <td>${prodotto.nome_filiale || '-'}</td>
                <td>
                    <div class="btn-group">
                    <button class="btn-edit" data-id="${prodotto.id}">Modifica <i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-remove" data-id="${prodotto.id}">Rimuovi <i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            corpoTabella.appendChild(row);
        });
    }

    function aggiungiProdotto(e) {
        e.preventDefault();

        const nome = inputNome.value.trim();
        const codice = inputCodice ? inputCodice.value.trim() : '';
        const categoria = inputCategoria ? inputCategoria.value.trim() : '';
        const prezzo = inputPrezzo.value.trim();
        const quantita = inputQuantita.value.trim();

        if (!nome || !prezzo || !quantita) {
            alert('Nome, prezzo e quantità sono obbligatori');
            return;
        }

        const payload = { nome, codice, categoria, prezzo, giacenza: quantita };

        fetch('/supermercato-gestionale/controllers/products/prodotto-aggiungi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Prodotto aggiunto con successo');
                    formProduct.reset();
                    closeModal();
                    caricaProdotti();
                } else {
                    alert('Errore nel aggiunta del prodotto: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    };

    function modificaProdotto(e) {
        e.preventDefault();

        const id = inputId.value.trim();
        const nome = inputNome.value.trim();
        const codice = inputCodice ? inputCodice.value.trim() : '';
        const categoria = inputCategoria ? inputCategoria.value.trim() : '';
        const prezzo = inputPrezzo.value.trim();
        const quantita = inputQuantita.value.trim();

        if (!id || !nome || !prezzo || !quantita) {
            alert('Id, nome, prezzo e quantità sono obbligatori');
            return;
        }

        const payload = { id, nome, codice, categoria, prezzo, giacenza: quantita };

        fetch('/supermercato-gestionale/controllers/products/prodotto-modifica.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Prodotto modificato con successo');
                    formProduct.reset();
                    closeModal();
                    caricaProdotti();
                } else {
                    alert('Errore nella modifica del prodotto: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function rimuoviProdotto(id) {
        fetch('/supermercato-gestionale/controllers/products/prodotto-rimuovi.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Prodotto rimosso con successo!');
                    closeModal();
                    caricaProdotti();
                } else {
                    alert('Errore nella rimozione del prodotto: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function openModal(titolo, prodotto = null) {
        modalTitle.textContent = titolo;

        if (prodotto) {
            inputId.value = prodotto.id;
            inputNome.value = prodotto.nome;
            if (inputCodice) inputCodice.value = prodotto.codice || '';
            if (inputCategoria) inputCategoria.value = prodotto.categoria || '';
            inputPrezzo.value = prodotto.prezzo;
            inputQuantita.value = prodotto.giacenza;
        } else {
            inputId.value = '';
            inputNome.value = '';
            if (inputCodice) inputCodice.value = '';
            if (inputCategoria) inputCategoria.value = '';
            inputPrezzo.value = '';
            inputQuantita.value = '';
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
        const totalProducts = document.getElementById('totalProducts');
        if (totalProducts) {
            totalProducts.textContent = prodottiGlobali.length;
        }
    }

    function filtraProdotti() {
        const filter = searchbar.value.toUpperCase().trim();

        if (!filter) {
            popolaTabella(prodottiGlobali);
            return;
        }

        const prodottiFiltrati = prodottiGlobali.filter(p => {
            const filiale = (p.nome_filiale || '').toUpperCase();
            return filiale.startsWith(filter);
        });

        popolaTabella(prodottiFiltrati);
    }



    function ordinaTabella(asc) {
        const sorted = [...prodottiGlobali].sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();

            return asc ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
        });

        popolaTabella(sorted);
    }

    searchbar.addEventListener('keyup', filtraProdotti);
    btnAlpAsc.addEventListener('click', () => ordinaTabella(false));
    btnAlpDec.addEventListener('click', () => ordinaTabella(true));
    btnAggiungi.addEventListener('click', () => openModal('Aggiungi nuovo prodotto'));

    if (formProduct) {
        formProduct.addEventListener('submit', (e) => {
            if (inputId.value) {
                modificaProdotto(e);
            } else {
                aggiungiProdotto(e);
            }
        });
    }

    caricaProdotti();
});
