let currentStoreData = []; // Global variable to hold current store data
let clients = []; // Global variable to hold client data

// Function to fetch client data from the API
async function getClientData() {
    try {
        const response = await fetch('http://localhost:3000/clientes'); // Adjust this URL as necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        clients = await response.json();
    } catch (error) {
        console.error('Error fetching client data:', error);
    }
}

// Function to open SweetAlert2 modal with store info and client select
async function openStoreModal(storeName, vehicles) {
    await getClientData(); // Fetch clients when opening the modal

    currentStoreData = vehicles; // Store current vehicles in a global variable

    const vehicleInfoHtml = vehicles.map(vehicle => `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
            <span>Modelo: ${vehicle.modelo} | Preço: R$ ${vehicle.preco.toFixed(2)}</span>
            <button onclick="openSellModal(${vehicle.id}, '${vehicle.modelo}')" class="sell-button">Vender</button>
        </div>
    `).join('');

    Swal.fire({
        title: storeName,
        html: `<div style="text-align: left; margin-top: 20px;">${vehicleInfoHtml}</div>`,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: 'custom-swal-popup'
        }
    });
}

// Function to open sell modal for selected vehicle
async function openSellModal(vehicleId, vehicleModelo) {
    // Create the client select options
    const clientOptionsHtml = clients.map(client => `
        <option value="${client.id}">${client.nome}</option>
    `).join('');

    // Modal HTML for selling the vehicle
    const modalHtml = `
        <div>
            <h3>${vehicleModelo}</h3>
            <label for="clientSelect">Cliente:</label>
            <select id="clientSelect" onchange="toggleConfirmButton()">
                <option value="">Selecione um cliente</option>
                ${clientOptionsHtml}
            </select>
        </div>
    `;

    // Open the SweetAlert modal
    const { value: confirmed } = await Swal.fire({
        title: `Vender ${vehicleModelo}`,
        html: modalHtml,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const clientId = document.getElementById('clientSelect').value;
            if (!clientId) {
                Swal.showValidationMessage('Por favor, selecione um cliente!');
                return false; // Prevent closing the modal
            }
            return { clientId }; // Return the selected client ID
        }
    });

    if (confirmed) {
        await handleSell(vehicleId, confirmed.clientId); // Process the sale with the selected client ID
    }
}

// Function to toggle confirm button based on client selection
function toggleConfirmButton() {
    const clientSelect = document.getElementById('clientSelect');
    const confirmButton = Swal.getConfirmButton();
    confirmButton.disabled = !clientSelect.value; // Enable button if a client is selected
}

// Function to handle selling the vehicle
async function handleSell(vehicleId, clientId) {
    try {
        const response = await fetch(`http://localhost:3000/alocacao/${vehicleId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            Swal.fire('Vendido!', 'O veículo foi vendido com sucesso.', 'success');
            // Optionally, update the stock or perform other actions here

            // Update the current store data to reflect the sale
            currentStoreData = currentStoreData.filter(vehicle => vehicle.id !== vehicleId);

            // Check if there are remaining vehicles in the store
            if (currentStoreData.length > 0) {
                openStoreModal(currentStoreData[0].concessionaria, currentStoreData); // Update modal with new data
            } else {
                Swal.fire('Sem Veículos!', 'Não há mais veículos disponíveis nesta loja.', 'info');
            }
        } else {
            Swal.fire('Erro!', 'Não foi possível completar a venda.', 'error');
        }
    } catch (error) {
        console.error('Erro ao vender veículo:', error);
        Swal.fire('Erro!', 'Houve um problema na venda.', 'error');
    }
}

// Function to fetch store data from the API
async function getStoreData() {
    try {
        const response = await fetch('http://localhost:3000/alocacao/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const stores = await response.json();

        // Group vehicles by area
        const groupedStores = stores.reduce((acc, store) => {
            const areaId = store.area;
            if (!acc[areaId]) {
                acc[areaId] = {
                    id: areaId,
                    name: store.concessionaria.concessionaria, // Store name
                    vehicles: []  // Initialize an array to hold all vehicles in this area
                };
            }

            // Add each automovel to the vehicles array
            acc[areaId].vehicles.push({
                id: store.automovel.id, // Ensure each vehicle has a unique ID
                modelo: store.automovel.modelo,
                preco: store.automovel.preco,
            });

            return acc;
        }, {});

        // Return as an array of areas with grouped vehicles
        return Object.values(groupedStores);
    } catch (error) {
        console.error('Error fetching store data:', error);
        return [];
    }
}

// Function to initialize patios with store information
async function initializePatios() {
    const patios = document.querySelectorAll('[class^="patio"]');
    const stores = await getStoreData();

    patios.forEach(patio => {
        const patioId = patio.getAttribute('data-id');

        // Find the store data based on the patio ID
        const store = stores.find(store => store.id === patioId);

        if (store) {
            patio.style.backgroundColor = 'lightgreen'; // Set background color to indicate a linked store
            patio.addEventListener('click', () => {
                openStoreModal(store.name, store.vehicles); // Open modal with store name and vehicles
            });
        }
    });
}

// Initialize patios with data from the database
initializePatios();
