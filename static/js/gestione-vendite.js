let venditeGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('searchbar');
    const corpoTabella = document.getElementById('salesBody');

    corpoTabella.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-remove')) {
            if (confirm('Sei proprio sicuro di voler cancellare questa vendita')) {
                rimuoviVendita(id);
            }
        }

        if (target.classList.contains('btn-edit')) {
            const vendita = venditeGlobali.find(v => v.id == id);
            if (vendita) openModal('Modifica vendita', vendita);
        }
    });

    const btnAggiungi = document.getElementById('btnAggiungi');
    const btnAlpDec = document.getElementById('alpDec');
    const btnAlpAsc = document.getElementById('alpAsc');

    const modal = document.getElementById('saleModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.querySelector('.modal .close');

    const inputId = document.getElementById('saleId');
    const inputCliente = document.getElementById('saleCliente');
    const inputData = document.getElementById('saleData');
    const inputProdotto = document.getElementById('saleProdotto');
    const inputImporto = document.getElementById('saleImporto');
    const inputQuantita = document.getElementById('saleQuantita');

    const formSale = document.getElementById('saleForm');

    function caricaVendite() {
        fetch('/supermercato-gestionale/core/vendite.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Errore nel caricamento delle vendite: ' + data.error);
                    return;
                }
                venditeGlobali = data;
                popolaTabella(venditeGlobali);
                aggiornaContatore();
            })
            .catch(err => alert('Errore di rete: ' + err));
    }

    function popolaTabella(vendite) {
        corpoTabella.innerHTML = '';

        vendite.forEach(vendita => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${vendita.id_cliente}</td>
            <td>${vendita.id_prodotto}</td>
            <td>${vendita.quantità}</td>
            <td>${vendita.data_vendita}</td>
            <td>${vendita.id_filiale}</td>
            <td>${vendita.metodo_pagamento}</td>
            <td>
                <div class="btn-group">
                    <button class="btn-edit" data-id="${vendita.id}">Modifica <i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-remove" data-id="${vendita.id}">Rimuovi <i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
            corpoTabella.appendChild(row);
        });
    }


    function aggiungiVendita(e) {
        e.preventDefault();

        const cliente = inputCliente.value.trim();
        const data = inputData.value.trim();
        const prodotto = inputProdotto.value.trim();
        const importo = inputImporto.value.trim();
        const quantita = inputQuantita.value.trim();

        if (!cliente || !data || !prodotto || !importo || !quantita) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { cliente, data, prodotto, importo, quantita };

        fetch('/supermercato-gestionale/controllers/sales/vendita-aggiungi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Vendita aggiunta con successo');
                    formSale.reset();
                    closeModal();
                    caricaVendite();
                } else {
                    alert('Errore nel aggiunta della vendita: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function modificaVendita(e) {
        e.preventDefault();

        const id = inputId.value.trim();
        const cliente = inputCliente.value.trim();
        const data = inputData.value.trim();
        const prodotto = inputProdotto.value.trim();
        const importo = inputImporto.value.trim();
        const quantita = inputQuantita.value.trim();

        if (!id || !cliente || !data || !prodotto || !importo || !quantita) {
            alert('Tutti i campi sono obbligatori');
            return;
        }

        const payload = { id, cliente, data, prodotto, importo, quantita };

        fetch('/supermercato-gestionale/controllers/sales/vendita-modifica.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Vendita modificata con successo');
                    formSale.reset();
                    closeModal();
                    caricaVendite();
                } else {
                    alert('Errore nella modifica della vendita: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function rimuoviVendita(id) {
        fetch('/supermercato-gestionale/controllers/sales/vendita-rimuovi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Vendita rimosso con successo');
                    closeModal();
                    caricaVendite();
                } else {
                    alert('Errore nella rimozione della vendita: ' + data.error);
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
                alert('Errore di rete: ' + err);
            });
    }

    function openModal(titolo, vendita = null) {
        modalTitle.textContent = titolo;

        if (vendita) {
            inputId.value = vendita.id;
            inputCliente.value = vendita.cliente || '';
            inputData.value = vendita.data || '';
            inputProdotto.value = vendita.prodotto || '';
            inputImporto.value = vendita.importo || '';
            inputQuantita.value = vendita.quantita || '';
        } else {
            inputId.value = '';
            inputCliente.value = '';
            inputData.value = '';
            inputProdotto.value = '';
            inputImporto.value = '';
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
        const totalSales = document.getElementById('totalSales');
        if (totalSales) {
            totalSales.textContent = venditeGlobali.length;
        }
    }

    function filtraVendite() {
        const filter = searchbar.value.toUpperCase().trim();

        if (!filter) {
            popolaTabella(venditeGlobali);
            return;
        }

        const venditeFiltrate = venditeGlobali.filter(v => {
            const cliente = (v.cliente || '').toUpperCase();
            return cliente.startsWith(filter);
        });

        popolaTabella(venditeFiltrate);
    }

    function ordinaTabella(asc) {
        const sorted = [...venditeGlobali].sort((a, b) => {
            const clienteA = a.cliente.toLowerCase();
            const clienteB = b.cliente.toLowerCase();

            return asc ? clienteA.localeCompare(clienteB) : clienteB.localeCompare(clienteA);
        });

        popolaTabella(sorted);
    }

    searchbar.addEventListener('keyup', filtraVendite);
    btnAlpAsc.addEventListener('click', () => ordinaTabella(false));
    btnAlpDec.addEventListener('click', () => ordinaTabella(true));
    btnAggiungi.addEventListener('click', () => openModal('Aggiungi nuova vendita'));

    if (formSale) {
        formSale.addEventListener('submit', (e) => {
            if (inputId.value) {
                modificaVendita(e);
            } else {
                aggiungiVendita(e);
            }
        });
    }

    caricaVendite();
});
