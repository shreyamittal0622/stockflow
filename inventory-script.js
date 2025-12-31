// Utils: get and save products from localStorage
function getProducts() {
    const stored = localStorage.getItem('stockflow_products');
    return stored ? JSON.parse(stored) : [];
}

function saveProducts(list) {
    localStorage.setItem('stockflow_products', JSON.stringify(list));
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const nameInput = document.getElementById('name');
    const qtyInput = document.getElementById('quantity');
    const thresholdInput = document.getElementById('threshold');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const tableBody = document.querySelector('#products-table tbody');

    let editing = false;

    load();

    form.addEventListener('submit', onFormSubmit);
    cancelBtn.addEventListener('click', resetForm);

    function load() {
        const list = getProducts();
        renderTable(list);
    }

    function renderTable(products) {
        tableBody.innerHTML = '';
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.threshold}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');

            editBtn.onclick = () => startEdit(product);
            deleteBtn.onclick = () => deleteProduct(product.id);

            tableBody.appendChild(tr);
        });
    }

    function onFormSubmit(e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const quantity = Number(qtyInput.value);
        const threshold = Number(thresholdInput.value);

        if (!name || isNaN(quantity)) {
            alert('Name and quantity are required.');
            return;
        }

        const list = getProducts();

        if (editing) {
            const id = productIdInput.value;
            const index = list.findIndex(p => p.id === id);
            if (index >= 0) {
                list[index].name = name;
                list[index].quantity = quantity;
                list[index].threshold = threshold;
            }
        } else {
            const newProduct = {
                id: generateId(),
                name,
                quantity,
                threshold
            };
            list.push(newProduct);
        }

        saveProducts(list);
        load();
        resetForm();
    }

    function startEdit(product) {
        editing = true;
        productIdInput.value = product.id;
        nameInput.value = product.name;
        qtyInput.value = product.quantity;
        thresholdInput.value = product.threshold;
        submitBtn.textContent = 'Update';
        cancelBtn.style.display = 'inline-block';
    }

    function resetForm() {
        editing = false;
        productIdInput.value = '';
        nameInput.value = '';
        qtyInput.value = '';
        thresholdInput.value = '';
        submitBtn.textContent = 'Save';
        cancelBtn.style.display = 'none';
    }

    function deleteProduct(id) {
        if (!confirm('Delete this product?')) return;
        const newList = getProducts().filter(p => p.id !== id);
        saveProducts(newList);
        load();
    }
});
