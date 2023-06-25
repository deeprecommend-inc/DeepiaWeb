const downloadImage = (base64Data: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:image/png;base64,' + base64Data);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

export default downloadImage;

// 使い方：
// const dataUrl =
//     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
// const filename = 'myImage.png';
// downloadImage(dataUrl, filename);
