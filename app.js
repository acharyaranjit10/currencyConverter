const BASE_URL = 'https://v6.exchangerate-api.com/v6/b8898ef67ee0efc9be69e9c2/latest/';
const dropDowns = document.querySelectorAll(".select-country select");
const btn = document.querySelector("#btn");
const textArea = document.querySelector(".msg");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const switch_flag = document.querySelector(".change");


switch_flag.addEventListener("click", (evt) => {
    evt.preventDefault();
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchgRate();
});

for (const select of dropDowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        }
        if (select.name === "to" && currCode === "NPR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

let updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let oldImage = element.parentElement.querySelector("img");
    let newImageSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    oldImage.src = newImageSrc;
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchgRate();
});

let updateExchgRate = async () => {
    let URL = `${BASE_URL}${fromCurr.value}`;
    let amount = document.querySelector(".amount input");
    if (amount.value === "" || amount.value < 1) {
        amount.value = '1';
    }
    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        let ans = data.conversion_rates[toCurr.value];
        textArea.innerHTML = `${amount.value} ${fromCurr.value} = ${(ans * amount.value).toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        textArea.innerHTML = 'Error fetching exchange rate. Please try again later.';
    }
};
