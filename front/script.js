const storeData = [
    { id: 1, name: 'Store 1', info: 'This is Store 1' },
    { id: 2, name: 'Store 2', info: 'This is Store 2' },
    { id: 3, name: 'Store 3', info: 'This is Store 3' },
    { id: 5, name: 'Store 5', info: 'This is Store 5' }
];

// Function to open SweetAlert2 modal with store info
function openStoreModal(storeName, storeInfo) {
    Swal.fire({
        title: storeName,
        text: storeInfo,
        icon: 'info',
        confirmButtonText: 'Close'
    });
}

// Function to fetch store data (replace this with actual fetch from your database/API)
async function getStoreData() {
    // Simulating fetching data
    return new Promise(resolve => {
        setTimeout(() => resolve(storeData), 500);
    });
}

// Function to initialize patios with store information
async function initializePatios() {
    const patios = document.querySelectorAll('[class^="patio"]');
    const stores = await getStoreData();

    patios.forEach(patio => {
        const patioId = parseInt(patio.getAttribute('data-id'));

        const store = stores.find(store => store.id === patioId);

        if (store) {
            patio.style.backgroundColor = 'lightgreen'; // Directly set the background color
            patio.addEventListener('click', () => {
                openStoreModal(store.name, store.info);
            });
        }
    });
}

// Initialize patios with data from the database
initializePatios();
