// الدالة لتحميل المنتجات من ملف JSON وعرضها على الصفحة
async function loadProducts() {
  try {
    const response = await fetch("products.json"); // تحميل بيانات المنتجات
    const products = await response.json();

    const container = document.getElementById("products-container");

    products.forEach(product => {
      // إنشاء بطاقة لكل منتج
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price}</p>
                <button onclick="showOrderForm('${product.name}')">طلب المنتج</button>
            `;

      container.appendChild(productCard);
    });
  } catch (error) {
    console.error("خطأ في تحميل المنتجات:", error);
  }
}

// استدعاء الدالة عند تحميل الصفحة
window.onload = loadProducts;

// دالة لإظهار نموذج الطلب للمنتج المحدد
function showOrderForm(productName) {
  alert(`تم اختيار: ${productName}، يرجى إدخال بياناتك لإتمام الطلب.`);
  // هنا يمكنك إضافة الخطوات لإظهار نموذج الطلب، مثل إظهار الحقول المطلوبة
}