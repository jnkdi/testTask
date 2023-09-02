document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".newsletter__form");
    const phoneInput = document.querySelector("#phone");
    const errorMsg = document.querySelector("#phoneError");
    const errorMap = [
        "Invalid number",
        "Invalid country code",
        "Too short",
        "Too long",
        "Invalid number",
    ];

    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("us"));
        },
        utilsScript: "./node_modules/intl-tel-input/build/js/utils.js"
    });

    const resetPhoneValidation = () => {
        phoneInput.classList.remove("invalid");
        errorMsg.textContent = "";
        errorMsg.style.display = "none";
    };

    phoneInput.addEventListener("change", resetPhoneValidation);
    phoneInput.addEventListener("keyup", resetPhoneValidation);

    form.addEventListener("submit", function (event) {
        let isValid = true;
        resetPhoneValidation();

        const allInputs = form.querySelectorAll(".newsletter__input");
        allInputs.forEach((input) => {
            input.classList.remove("invalid");
            const errorSpanId = input.id + "Error";
            const errorSpan = document.getElementById(errorSpanId);
            if (errorSpan) {
                errorSpan.textContent = "";
                errorSpan.style.display = "none";
            }
        });

        const nameInput = document.getElementById("name");
        const surnameInput = document.getElementById("surname");
        const emailInput = document.getElementById("email");
        const checkbox = document.querySelector(".newsletter__checkbox");

        const nameSurnamePattern = /^[A-Za-zА-Яа-я]{2,}$/;

        if (!nameSurnamePattern.test(nameInput.value)) {
            isValid = false;
            nameInput.classList.add("invalid");
            document.getElementById("nameError").textContent =
                "Name should have at least 2 characters and no numbers or special symbols.";
            document.getElementById("nameError").style.display = "block";
        }

        if (!nameSurnamePattern.test(surnameInput.value)) {
            isValid = false;
            surnameInput.classList.add("invalid");
            document.getElementById("surnameError").textContent =
                "Surname should have at least 2 characters and no numbers or special symbols.";
            document.getElementById("surnameError").style.display = "block";
        }

        const emailPattern = /^[^@]+@[^@]+\.[a-z]{2,}$/i;

        if (!emailPattern.test(emailInput.value)) {
            isValid = false;
            emailInput.classList.add("invalid");
            document.getElementById("emailError").textContent =
                "Please enter a valid email address.";
            document.getElementById("emailError").style.display = "block";
        }

        const rawNumber = phoneInput.value.replace(/\D+/g, "");
        if (rawNumber.length < 1) {
            isValid = false;
            phoneInput.classList.add("invalid");
            errorMsg.textContent = "Phone number is required.";
            errorMsg.style.display = "block";
        }

        if (phoneInput.value !== rawNumber) {
            isValid = false;
            phoneInput.classList.add("invalid");
            errorMsg.textContent = "Phone number can contain numbers only.";
            errorMsg.style.display = "block";
        } else if (phoneInput.value.trim() && !iti.isValidNumber()) {
            isValid = false;
            phoneInput.classList.add("invalid");
            const errorCode = iti.getValidationError();
            errorMsg.textContent = errorMap[errorCode];
            errorMsg.style.display = "block";
        }

        if (!checkbox.checked) {
            isValid = false;
            document.getElementById("checkboxError").textContent =
                "Please agree to the terms by selecting the checkbox.";
            document.getElementById("checkboxError").style.display = "block";
        }

        if (!isValid) {
            event.preventDefault();
        }
    });
});
