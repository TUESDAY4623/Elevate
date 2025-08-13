// Form validation
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let messageError = document.getElementById("messageError");
    let successMessage = document.getElementById("successMessage");
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    successMessage.textContent = "";
    let valid = true;
    if (name === "") {
        nameError.textContent = "Name is required";
        valid = false;
    }
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        emailError.textContent = "Email is required";
        valid = false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = "Enter a valid email address";
        valid = false;
    }
    if (message === "") {
        messageError.textContent = "Message is required";
        valid = false;
    }
    if (valid) {
        successMessage.textContent = "✅ Your message has been submitted successfully!";
        document.getElementById("contactForm").reset();
        // Animate success message
        successMessage.style.opacity = 0;
        successMessage.style.transition = "opacity 0.6s";
        setTimeout(() => {
            successMessage.style.opacity = 1;
        }, 100);
        setTimeout(() => {
            successMessage.style.opacity = 0;
        }, 2500);
    }
});

// Dark mode toggle
const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")) {
        darkToggle.textContent = "☀️ Light Mode";
    } else {
        darkToggle.textContent = "🌙 Dark Mode";
    }
});

// Form entrance animation
window.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("formContainer");
    formContainer.style.opacity = 0;
    formContainer.style.transform = "translateY(40px) scale(0.98)";
    setTimeout(() => {
        formContainer.style.transition = "opacity 0.8s, transform 0.8s cubic-bezier(.68,-0.55,.27,1.55)";
        formContainer.style.opacity = 1;
        formContainer.style.transform = "translateY(0) scale(1)";
    }, 150);
});

// Button ripple animation
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", function(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = (e.clientX - rect.left) + "px";
    ripple.style.top = (e.clientY - rect.top) + "px";
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + "px";
    ripple.style.background = "rgba(255,255,255,0.3)";
    ripple.style.borderRadius = "50%";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.pointerEvents = "none";
    ripple.style.transition = "transform 0.5s, opacity 0.5s";
    ripple.style.opacity = 1;
    ripple.className = "ripple-effect";
    btn.appendChild(ripple);
    setTimeout(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(2.5)";
        ripple.style.opacity = 0;
    }, 10);
    setTimeout(() => {
        btn.removeChild(ripple);
    }, 600);
});
