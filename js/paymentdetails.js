const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("You would be taken to secure payment provides, press any key to exit:", validity => {
    console.log(validity);
    process.stdout.write(validity);
    readline.close();
});
