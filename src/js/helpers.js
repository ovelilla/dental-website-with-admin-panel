export const formatCurrency = (amount) => {
    const options = {
        style: "currency",
        currency: "EUR",
    };

    return new Intl.NumberFormat("es-ES", options).format(amount);
};

export const dateFormat = (date) => {
    const newDate = new Date(date);
    const options = {
        dateStyle: "long",
    };
    return new Intl.DateTimeFormat("es-ES", options).format(newDate);
};

export const toSeoUrl = (str) => {
    const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
    const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
    const p = new RegExp(a.split("").join("|"), "g");

    return str
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(p, (c) => b.charAt(a.indexOf(c)))
        .replace(/&/g, "-and-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
};

export const cleanHTML = (el) => {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};

export const getCurrentPage = () => {
    return window.location.pathname.slice(1) || "index";
};

export const isEmpty = (obj) => {
    for (const i in obj) {
        return false;
    }
    return true;
};

export const isObject = (obj) => {
    return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
};

export const isNumeric = (n) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
};
