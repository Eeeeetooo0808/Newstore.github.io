document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // تحقق من اسم المستخدم وكلمة المرور
  if (username === "admin" && password === "admin123") { // يمكنك تغيير هذه القيم
    // إعادة توجيه المستخدم إلى صفحة المشرف
    window.location.href = "admin.html";
  } else {
    alert("اسم المستخدم أو كلمة المرور غير صحيحة.");
  }
});