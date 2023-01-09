export * from './constants';


export const getFormBody = (params) => {
    let formBody = [];

    for (let property in params) {
        let encodeKey = encodeURIComponent(property); // 'user name' => 'user%20name'
        let encodedValue = encodeURIComponent(params[property]); // sanam 123 => sanam%20123

        formBody.push(encodeKey + '=' + encodedValue);

    }
    return formBody.join('&'); // 'username=sanam&password=123'

}


export const setItemInLocalStorage = (key, value) => {
    if (!key || !value) {
        return console.error("can not store in LS");
    }

    const valueToStore = typeof value !== 'string' ? JSON.stringify(value) : value;

    return localStorage.setItem(key, valueToStore);
}


export const getItemInLocalStorage = (key) => {
    if (!key) {
        return console.error("can not get value in LS");
    }


    return localStorage.getItem(key);
}

export const removeItemInLocalStorage = (key) => {
    if (!key) {
        return console.error("can not get value in LS");
    }


    return localStorage.removeItem(key);
}