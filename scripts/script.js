//#region Imports

import Currency from "./rate.js";
import Status from "./Status.enum.js";

//#endregion

//#region Global Variables

const currencyFrom = document.querySelectorAll(".converter__from .button-currency");
const currencyTo = document.querySelectorAll(".converter__to .button-currency");
const inputFrom = document.querySelector("#inputFrom");
const inputFromRate = document.querySelector("#inputFromRate");
const inputTo = document.querySelector("#inputTo");
const inputToRate = document.querySelector("#inputToRate");

let currencyFromActive = document.querySelector(".converter__from .button-currency.active") ?? null;
let currencyToActive = document.querySelector(".converter__to .button-currency.active") ?? null;

let changeRateView = () => {
    inputFromRate.textContent = `1 ${currency.from} = ${currency.rateFromTo} ${currency.to}`;
    inputToRate.textContent = `1 ${currency.to} = ${currency.rateToFrom} ${currency.from}`;
}

const currency = new Currency(currencyFromActive.textContent, currencyToActive.textContent, changeRateView);

//#endregion

//#region Events

currencyFrom.forEach(currencyFrom => {
    currencyFrom.addEventListener("click", async ({ target }) => {
        await changeInputsCheckReverse(target.textContent, Status.FROM);
        currencyFromActive = changeCurrencyActive(currencyFromActive, target);
    });
});

currencyTo.forEach(currencyTo => {
    currencyTo.addEventListener("click", async ({ target }) => {
        await changeInputsCheckReverse(target.textContent, Status.TO);
        currencyToActive = changeCurrencyActive(currencyToActive, target);
    });
});

inputFrom.addEventListener("keydown", checkInput);
inputFrom.addEventListener("keyup", () => {changeInput(Status.FROM)});
inputFrom.addEventListener('contextmenu', event => event.preventDefault());

inputTo.addEventListener("keydown", checkInput);
inputTo.addEventListener("keyup", () => {changeInput(Status.TO)});
inputTo.addEventListener('contextmenu', event => event.preventDefault());

//#endregion

function changeCurrencyActive(prevButton, button) {
    if (button.textContent === prevButton.textContent) {
        return prevButton;
    }
    if (prevButton != null) {
        prevButton.classList.remove("active");
    }
    button.classList.add("active");
    return button;
}

async function changeInputsCheckReverse(newContent, status) {
    let oldContent = "";
    switch (status) {
        case Status.FROM:
            if (currencyToActive.textContent !== newContent) {
                await currency.setFrom(newContent);
                changeInput(Status.FROM);
                return;
            }
            oldContent = currencyFromActive.textContent;
            currencyTo.forEach(searchAndClick);
            break;
        case Status.TO:
            if (currencyFromActive.textContent !== newContent) {
                await currency.setTo(newContent);
                changeInput(Status.FROM);
                return;
            }
            oldContent = currencyToActive.textContent;
            currencyFrom.forEach(searchAndClick);
            break;
        default:
            break;
    }

    async function searchAndClick(button) {
        if (button.textContent === oldContent) {
            // button.click();
            switch (status) {
                case Status.FROM:
                    currencyToActive = changeCurrencyActive(currencyToActive, button);
                    break;
                case Status.TO:
                    currencyFromActive = changeCurrencyActive(currencyFromActive, button);
                    break;
                default:
                    break;
            }
            currency.reverse();
            await changeInput(Status.FROM);
            return;
        }
    }
}

function checkInput(event) {
    if (isNaN(event.key)) {
        if (event.code !== "Backspace") {
            event.preventDefault();
            return;
        }
    }
}

async function changeInput(status) {
    switch (status) {
        case Status.FROM:
            inputTo.value = currency.amountFromTo(inputFrom.value);
            break;
        case Status.TO:
            inputFrom.value = currency.amountToFrom(inputTo.value);
            break;
        // case Status.BOTH:
        //     let tmp = inputFrom.value;
        //     inputFrom.value = inputTo.value;
        //     inputTo.value = tmp;
        //     break;
    }
}
