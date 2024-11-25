const API_URL = "https://dummyjson.com/products";
const tableBody = document.getElementById("productsTable").querySelector("tbody");
const filterInput = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

let originalData = [];
let filteredData = [];

// pobieranie danych z API
const fetchData = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        originalData = data.products.slice(0, 30); // Pobierz pierwsze 30 elementów
        filteredData = [...originalData];
        renderTable(filteredData);
    } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
    }
};

// renderowanie tabeli
const renderTable = (data) => {
    tableBody.innerHTML = ""; // wyczyszczenie tabeli
    data.forEach(product => {
        const row = `
            <tr>
                <td><img src="${product.thumbnail}" alt="Zdjęcie" width="50"></td>
                <td>${product.title}</td>
                <td>${product.description}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
};

// filtrowanie danych
const filterData = () => {
    const query = filterInput.value.toLowerCase();
    filteredData = originalData.filter(product =>
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
    );
    renderTable(filteredData);
};

// sortowanie danych
const sortData = () => {
    const sortValue = sortSelect.value;
    if (sortValue === "ascending") {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "descending") {
        filteredData.sort((a, b) => b.title.localeCompare(a.title));
    } else {
        filteredData = [...originalData];
    }
    renderTable(filteredData);
};

// Obsługa zdarzeń
filterInput.addEventListener("input", filterData);
sortSelect.addEventListener("change", sortData);

// Pobranie danych przy załadowaniu strony
fetchData();

