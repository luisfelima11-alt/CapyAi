const fs = require('fs');
const path = require('path');

const directory = __dirname;
const targetImage = '11_Hello_Yara_profile_pic_002.png';

const htmlFiles = fs.readdirSync(directory).filter(file => file.endsWith('.html'));

const altTargets = [
    'Yara the Capybara',
    'Capy Avatar',
    'Capy Yara',
    'Friendly Capybara Yara',
    "Child's explorer avatar",
    'Child explorer avatar',
    'Capy Explorer'
];

htmlFiles.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace <img> tags with matching alt
    const imgRegex = /<img([^>]*?)alt=["']([^"']*)["']([^>]*?)src=["'](https:\/\/lh3\.googleusercontent\.com\/[^"']+)["']([^>]*?)>/g;
    content = content.replace(imgRegex, (match, p1, altText, p3, oldSrc, p5) => {
        if (altTargets.includes(altText)) {
            changed = true;
            return `<img${p1}alt="${altText}"${p3}src="${targetImage}"${p5}>`;
        }
        return match;
    });

    // Replace 4_Login_Capy_Yara_Welcomes_You.html specific inline style
    if (file === '4_Login_Capy_Yara_Welcomes_You.html') {
        const styleRegex = /style=['"]background-image:\s*url\([^)]+\)[\s;]*['"]/g;
        if (styleRegex.test(content)) {
            content = content.replace(styleRegex, `style='background-image: url("${targetImage}");'`);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated images in ${file}`);
    }
});
