function getList() {
    const list = localStorage.getItem('purchase_list');
    return list ? JSON.parse(list) : [];
}
function saveList(items) {
    localStorage.setItem('purchase_list', JSON.stringify(items))
}

document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('item')
    const qtyInput = document.getElementById('qty')
    const rateInput = document.getElementById('rate')
    const tableBody = document.querySelector('.purchase-table tbody')
    const submitBtn = document.querySelector('.submit-btn')
    const deleteBtn = document.querySelector('.delete-selected-btn')

    let selectedIndex = null

    load()
    submitBtn.addEventListener("click", onSubmit)
    deleteBtn.addEventListener("click", deleteSelected);

    function load() {
        tableBody.innerHTML="";
        const items = getList();
        items.forEach((prod, index) => addRow(prod, index));
    }


    function onSubmit(e) {
        e.preventDefault();
        const item = itemInput.value;
        const qty = Number(qtyInput.value);
        const rate = Number(rateInput.value);

        if (!item || !qty || !rate) {
            alert("please enter the fields");
            return;
        }
        const amt = rate * qty;
        const newEntry = { item, qty, rate, amt }
        const items = getList();
        items.push(newEntry)
        saveList(items)
        load();
        itemInput.value = "";
        qtyInput.value = "";
        rateInput.value = "";
    }
    function addRow(prod, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${prod.item}</td>
        <td>${prod.qty}</td>
        <td>${prod.rate}</td>
        <td>${prod.amt}</td>
      `;
        
        tr.addEventListener("click", () => {

            tr.classList.add("selected");
            selectedIndex = index;

        });
         tableBody.appendChild(tr);
        
    }
    function deleteSelected() {
        if (!confirm("Are you sure?")) return;
        const items = getList();
        items.splice(selectedIndex, 1); 
        saveList(items);
        selectedIndex = null;           
        load();
    }
});
