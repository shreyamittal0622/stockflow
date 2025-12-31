function getInList() {
    const list = localStorage.getItem('stock_in_list');
    return list ? JSON.parse(list) : [];
}

function saveInList(items) {
    localStorage.setItem('stock_in_list', JSON.stringify(items));
}

function getOutList() {
    const list = localStorage.getItem('stock_out_list');
    return list ? JSON.parse(list) : [];
}

function saveOutList(items) {
    localStorage.setItem('stock_out_list', JSON.stringify(items));
}

document.addEventListener('DOMContentLoaded', () => {
    const name1Input = document.getElementById('name1');
    const date1Input = document.getElementById('date1');
    const qty1Input  = document.getElementById('qty1');
    const ref1Input  = document.getElementById('ref1');

    const name2Input = document.getElementById('name2');
    const date2Input = document.getElementById('date2');
    const qty2Input  = document.getElementById('qty2');
    const ref2Input  = document.getElementById('ref2');

    const stockInBody  = document.querySelector('.stock-in tbody');
    const stockOutBody = document.querySelector('.stock-out tbody');

    const addInBtn  = document.querySelector('.stock-in + div .submit-btn');
    const addOutBtn = document.querySelector('.stock-out + div .submit-btn');

    const deleteInBtn  = document.querySelector('.stock-in + div .delete-selected-btn');
    const deleteOutBtn = document.querySelector('.stock-out + div .delete-selected-btn');

    const openStockEl  = document.getElementById('openStock');
    const totalInEl    = document.getElementById('totalIn');
    const totalOutEl   = document.getElementById('totalOut');
    const totalStockEl = document.getElementById('totalStock');

    let selectedInIndex  = null;
    let selectedOutIndex = null;

    loadAll();

    addInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = name1Input.value.trim();
        const date = date1Input.value;
        const qty  = Number(qty1Input.value);
        const ref  = ref1Input.value.trim();

        if (!name || qty <= 0) {
            alert("Please enter valid stock-in values");
            return;
        }
        const items = getInList();
        items.push({ name, date, qty, ref });
        saveInList(items);
        loadAll();
        clearInInputs();
    });

    addOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = name2Input.value.trim();
        const date = date2Input.value;
        const qty  = Number(qty2Input.value);
        const ref  = ref2Input.value.trim();

        if (!name || qty <= 0) {
            alert("Please enter valid stock-out values");
            return;
        }
        const items = getOutList();
        items.push({ name, date, qty, ref });
        saveOutList(items);
        loadAll();
        clearOutInputs();
    });

    deleteInBtn.addEventListener('click', () => {
        if (selectedInIndex === null) return;
        if (!confirm("Are you sure you want to delete this stock-in entry?")) return;
        const items = getInList();
        items.splice(selectedInIndex, 1);
        saveInList(items);
        selectedInIndex = null;
        loadAll();
    });

    deleteOutBtn.addEventListener('click', () => {
        if (selectedOutIndex === null) return;
        if (!confirm("Are you sure you want to delete this stock-out entry?")) return;
        const items = getOutList();
        items.splice(selectedOutIndex, 1);
        saveOutList(items);
        selectedOutIndex = null;
        loadAll();
    });

    function loadAll() {
        renderInTable();
        renderOutTable();
        updateSummary();
    }

    function renderInTable() {
        stockInBody.innerHTML = '';
        const items = getInList();
        items.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.qty}</td>
                <td>${item.ref}</td>
            `;
            tr.addEventListener('click', () => {
                clearSelections("in");
                tr.classList.add('selected');
                selectedInIndex = idx;
            });
            stockInBody.appendChild(tr);
        });
    }

    function renderOutTable() {
        stockOutBody.innerHTML = '';
        const items = getOutList();
        items.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.qty}</td>
                <td>${item.ref}</td>
            `;
            tr.addEventListener('click', () => {
                clearSelections("out");
                tr.classList.add('selected');
                selectedOutIndex = idx;
            });
            stockOutBody.appendChild(tr);
        });
    }

    function updateSummary() {
        const stockInItems  = getInList();
        const stockOutItems = getOutList();
        const totalIn  = stockInItems.reduce((sum, x) => sum + x.qty, 0);
        const totalOut = stockOutItems.reduce((sum, x) => sum + x.qty, 0);
        const openingStock = Number(localStorage.getItem('openingStock')) || 0;

        openStockEl.textContent  = openingStock;
        totalInEl.textContent    = totalIn;
        totalOutEl.textContent   = totalOut;
        totalStockEl.textContent = openingStock + totalIn - totalOut;
    }

    function clearInInputs() {
        name1Input.value = '';
        date1Input.value = '';
        qty1Input.value  = '';
        ref1Input.value  = '';
    }

    function clearOutInputs() {
        name2Input.value = '';
        date2Input.value = '';
        qty2Input.value  = '';
        ref2Input.value  = '';
    }

    function clearSelections(type) {
    document.querySelectorAll('tr.selected').forEach(row => {
        row.classList.remove('selected');
    });

    if (type === "in") selectedInIndex = null;
    if (type === "out") selectedOutIndex = null;
}

});
