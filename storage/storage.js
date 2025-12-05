export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}