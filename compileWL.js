const fs = require('fs');

async function main() {
    const holderJSONFolder = fs.readdirSync("./tx/GHLS");
    const files = holderJSONFolder.map((data) => {
        return JSON.parse(fs.readFileSync(`./tx/GHLS/${data}`, "utf-8"));
    }
    )
    const addresses = files.map(file => {
        return {address: `"${file[0].returnValues.to}"`, amount: 1};
    })
    console.log(addresses[0]);
    
    fs.writeFileSync(`./out/minters.txt`, addresses.toString());
}

main();