document.getElementById("generatePassword").addEventListener("click", () => {
    const minLength = parseInt(document.getElementById("minLength").value);
    const maxLength = parseInt(document.getElementById("maxLength").value);
    const includeUppercase = document.getElementById("uppercase").checked;
    const includeSpecialChars = document.getElementById("specialChars").checked;

    if (minLength > maxLength || minLength <= 0 || maxLength <= 0) {
        alert("Podaj poprawne długości hasła!");
        return;
    }

    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    const allChars = lowerChars + (includeUppercase ? upperChars : "") + (includeSpecialChars ? specialChars : "");

    if (allChars === lowerChars) {
        alert("Musisz wybrać co najmniej jedną opcję dodatkową!");
        return;
    }

    const passwordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    alert(`Wygenerowane hasło: ${password}`);
});
