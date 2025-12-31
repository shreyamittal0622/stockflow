function getSuppliers() {
    const stored = localStorage.getItem('stockflow_suppliers');
    return stored ? JSON.parse(stored) : [];
}

function saveSuppliers(list) {
    localStorage.setItem('stockflow_suppliers', JSON.stringify(list));
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supplierForm');
    const supplierIdInput = document.getElementById('supplier-id');
    const nameInput = document.getElementById('supplierName');
    const productInput = document.getElementById('productName');
    const qtyInput = document.getElementById('productQuantity');
    const contactInput = document.getElementById('contactInfo');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const tableBody = document.querySelector('#supplier-table tbody');

    let editing = false;

    loadAndRender();

    form.addEventListener('submit', onFormSubmit);
    cancelBtn.addEventListener('click', resetForm);

    function loadAndRender() {
        const items = getSuppliers();
        renderTable(items);
    }
       
    function renderTable(items) {
        tableBody.innerHTML = '';
        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
               <td>${item.supplierName}</td>
               <td>${item.productName}</td>
               <td>${item.quantitySupplied}</td>
               <td>${item.contactInfo}</td>
               <td>
                   <button class="edit-btn">Edit</button>
                   <button class="delete-btn">Delete</button>
               </td>
      `;
            const [editBtn, deleteBtn] = tr.querySelectorAll('button');
            editBtn.onclick = () => startEdit(item);
            deleteBtn.onclick = () => deleteSupplier(item.id);
            tableBody.appendChild(tr);
        });
    }

    function onFormSubmit(e) {
        e.preventDefault();
        const supplierName = nameInput.value.trim();
        const productName = productInput.value.trim();
        const quantitySupplied = Number(qtyInput.value);
        const contactInfo = contactInput.value.trim();

        if (!supplierName || !productName || !quantitySupplied) {
            alert('Please fill in required fields');
            return;
        }

        const list = getSuppliers();
        if (editing) {
            const id = supplierIdInput.value;
            const idx = list.findIndex(i => i.id === id);
            if (idx >= 0) {
                list[idx].supplierName = supplierName;
                list[idx].productName = productName;
                list[idx].quantitySupplied = quantitySupplied;
                list[idx].contactInfo = contactInfo;
            }
        } else {
            const newSupplier = {
                id: generateId(),
                supplierName,
                productName,
                quantitySupplied,
                contactInfo
            };
            list.push(newSupplier);
        }

        saveSuppliers(list);
        loadAndRender();
        resetForm();
    }

    function startEdit(item) {
        editing = true;
        supplierIdInput.value = item.id;
        nameInput.value = item.supplierName;
        productInput.value = item.productName;
        qtyInput.value = item.quantitySupplied;
        contactInput.value = item.contactInfo;
        submitBtn.textContent = 'Update';
        cancelBtn.style.display = 'inline-block';
    }

    function resetForm() {
        editing = false;
        supplierIdInput.value = '';
        nameInput.value = '';
        productInput.value = '';
        qtyInput.value = '';
        contactInput.value = '';
        submitBtn.textContent = 'Save';
        cancelBtn.style.display = 'none';
    }

    function deleteSupplier(id) {
        if (!confirm('Delete this supplier?')) return;
        const newList = getSuppliers().filter(i => i.id !== id);
        saveSuppliers(newList);
        loadAndRender();
    }
});
