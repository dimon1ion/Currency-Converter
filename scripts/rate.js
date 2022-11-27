export default class Currency{
    #_from;
    #_to;
    #_rate;

    #_callSaveChangesSaveChanges;

    constructor(from, to, callBackSaveChanges){
        this.#_from = from;
        this.#_to = to;
        this.#_callSaveChangesSaveChanges = callBackSaveChanges;
        this.#setRateFromServer().catch(er => {
            console.log("Init was error");
        });
    }

    reverse(){
        let tmp = this.#_from;
        this.#_from = this.#_to;
        this.#_to = tmp;
        this.#_rate = 1 / this.#_rate;
        this.#_callSaveChangesSaveChanges();
    }

    get from(){
        return this.#_from;
    }
    async setFrom(value){
        if (this.#_from === value.toUpperCase()) {
            return;
        }
        this.#_from = value.toUpperCase();
        await this.#setRateFromServer().catch(er => {
            console.log("Change from was error");
        });
    }

    get to(){
        return this.#_to;
    }
    async setTo(value){
        if (this.#_to === value.toUpperCase()) {
            return;
        }
        this.#_to = value.toUpperCase();
        await this.#setRateFromServer().catch(er => {
            console.log("Change to was error");
        });
    }

    get rateFromTo(){
        return this.#_rate.toFixed(5);
    }
    get rateToFrom(){
        return (1 / this.#_rate).toFixed(5);
    }

    amountFromTo(amount){
        return (amount * this.rateFromTo).toFixed(5);
    }

    amountToFrom(amount){
        return (amount * this.rateToFrom).toFixed(5);
    }

    async #setRateFromServer(){
        let data = await (await fetch(`https://api.exchangerate.host/convert?from=${this.#_from}&to=${this.#_to}`)).json();
        if (data.success !== true) {
            alert("Error");
            throw "Not work";
        }
        this.#_rate = data.info.rate;
        this.#_callSaveChangesSaveChanges();
    }
}