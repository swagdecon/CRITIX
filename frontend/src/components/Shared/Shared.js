// Functions that are shared between components should be put here 
export function validateImageURL(url) {
    const img = new Image();
    img.src = url;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            if (img.width > 0 && img.height > 0) {
                resolve(true);
            } else {
                reject(new Error("Invalid image URL"));
            }
        };
        img.onerror = () => {
            reject(new Error("Invalid image URL"));
        };
    });
}