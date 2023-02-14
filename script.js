const providersParam = [
    {
        name: "backblaze",
        providerPrice: document.querySelector("#backblaze_price"),
        providerBar: document.querySelector("#backblaze"),
        classColor: "cl_red",
        min: 7,
        storage: 0.005,
        transfer: 0.01
    },
    {
        name: "bunny",
        providerPrice: document.querySelector("#bunny_price"),
        providerBar: document.querySelector("#bunny"),
        classColor: "cl_orange",
        max: 10,
        storage: {
            hdd: 0.01,
            ssd: 0.02
        },
        transfer: 0.01
    },
    {
        name: "scaleway",
        providerPrice: document.querySelector("#scaleway_price"),
        providerBar: document.querySelector("#scaleway"),
        classColor: "cl_violet",
        storage: {
            multi: 0.06,
            single: 0.03
        },
        transfer: 0.02
    },
    {
        name: "vultr",
        providerPrice: document.querySelector("#vultr_price"),
        providerBar: document.querySelector("#vultr"),
        classColor: "cl_blue",
        min: 5,
        storage: 0.01,
        transfer: 0.01
    }
];

const widthValue = 5;

const rangeStorage = document.querySelector("#storage");
const rangeTransfer = document.querySelector("#transfer");

const memoryStorage = document.querySelector("#storage_memory");
const memoryTransfer = document.querySelector("#transfer_memory");

const providers = document.querySelector("#providers");

providers.addEventListener("click", (e) => {
    if (e.target.name === "bunny" || e.target.name === "scaleway") {
        setParameters(Number(memoryStorage.innerHTML), Number(memoryTransfer.innerHTML))
    }
});

rangeStorage.addEventListener("input", function () {
    const storageValue = Number(this.value);
    const transferValue = Number(memoryTransfer.innerHTML);
    memoryStorage.innerHTML = storageValue;
    setParameters(storageValue, transferValue);
});

rangeTransfer.addEventListener("input", function () {
    const storageValue = Number(memoryStorage.innerHTML);
    const transferValue = Number(this.value);
    memoryTransfer.innerHTML = transferValue;
    setParameters(storageValue, transferValue);
});

function toAmount(amount) {
    return amount % Math.ceil(amount) === 0 ? amount : amount.toFixed(2);
}

function drawBar(param, value) {
    param.providerPrice.innerHTML = value + "$";
    param.providerBar.style.width = value * widthValue + "px";
    param.providerBar.classList.remove(param.classColor);
    param.price = value;
}

function setParameters(storageValue, transferValue) {
    providersParam.forEach(p => {
        let result;
        switch (p.name) {
            case "backblaze":
                result = toAmount((storageValue * p.storage) + (transferValue * p.transfer));
                if (result == 0) {
                    result = 0;
                }
                else if (result < p.min) {
                    result = p.min;
                }
                drawBar(p, result);
                break;
            case "bunny":
                const bunnyParam = document.querySelector("input[name='bunny']:checked").value;
                result = toAmount((storageValue * p.storage[bunnyParam]) + (transferValue * p.transfer));
                if (result == 0) {
                    result = 0;
                }
                else if (result > p.max) {
                    result = 10;
                }
                drawBar(p, result);
                break;
            case "scaleway":
                const scaleParam = document.querySelector("input[name='scaleway']:checked").value;
                result = toAmount((storageValue > 75 ? (storageValue - 75) * p.storage[scaleParam] : 0) + (transferValue > 75 ? (transferValue - 75) * p.transfer : 0));
                if (result == 0) {
                    result = 0;
                }
                drawBar(p, result);
                break;
            case "vultr":
                result = toAmount((storageValue * p.storage) + (transferValue * p.transfer));
                if (result == 0) {
                    result = 0;
                }
                else if (result < p.min) {
                    result = p.min;
                }
                drawBar(p, result);
                break;
        }
    });

    providersParam.forEach(p => p.providerBar.classList.remove(p.classColor));
    const providerWithMinPrice = providersParam.sort((a, b) => a.price - b.price)[0];
    providerWithMinPrice.providerBar.classList.add(providerWithMinPrice.classColor);
}