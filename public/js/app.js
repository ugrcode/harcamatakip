document.getElementById('add-products').addEventListener('click', async () => {
    const productNames = document.getElementById('product-names').value.trim();
    const totalPrice = parseFloat(document.getElementById('total-price').value.trim());

    if (!productNames || isNaN(totalPrice)) {
        alert("Lütfen tüm alanları doğru şekilde doldurun.");
        return;
    }

    const products = productNames.split('*').map(product => product.trim()).filter(product => product);
    const totalProductCount = products.length;
    let totalCurrentPrice = 0;
    let totalProfitLoss = 0;

    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';

    for (let product of products) {
        const currentPrice = await getProductPrice(product);

        if (currentPrice !== null) {
            const purchasePrice = totalPrice / totalProductCount;
            const profitLoss = currentPrice - purchasePrice;

            const productItem = document.createElement('li');
            productItem.textContent = `${product} | Satın Alma: ${purchasePrice.toFixed(2)}₺ | Güncel Fiyat: ${currentPrice.toFixed(2)}₺ | Kar/Zarar: ${profitLoss.toFixed(2)}₺`;
            productListElement.appendChild(productItem);

            totalCurrentPrice += currentPrice;
            totalProfitLoss += profitLoss;
        } else {
            alert(`"${product}" için fiyat bulunamadı.`);
        }
    }

    updateTotalInfo(totalPrice, totalCurrentPrice, totalProfitLoss);
});

async function getProductPrice(productName) {
    const response = await fetch(`/scrape?product=${encodeURIComponent(productName)}`);
    const data = await response.json();
    return data.price || null;
}

function updateTotalInfo(totalPrice, totalCurrentPrice, totalProfitLoss) {
    document.getElementById('total-purchase').textContent = `Toplam Satın Alma Fiyatı: ${totalPrice.toFixed(2)}₺`;
    document.getElementById('total-current').textContent = `Toplam Güncel Fiyat: ${totalCurrentPrice.toFixed(2)}₺`;
    document.getElementById('total-profit-loss').textContent = `Kar/Zarar: ${totalProfitLoss.toFixed(2)}₺`;
}
