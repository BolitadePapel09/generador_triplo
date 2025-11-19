export function initRegexTester() {
    const regexInput = document.getElementById("regexInput");
    const flagsInput = document.getElementById("flagsInput");
    const testString = document.getElementById("testString");
    const resultBox = document.getElementById("result");

    const update = () => {
        const exp = regexInput.value;
        const flags = flagsInput.value;
        const test = testString.value;

        try {
            const regex = new RegExp(exp, flags);
            const match = test.match(regex);

            if (match) {
                resultBox.textContent = "Match found: " + JSON.stringify(match);
                resultBox.className = "result ok";
            } else {
                resultBox.textContent = "no match";
                resultBox.className = "result no";
            }
        } catch (e) {
            resultBox.textContent = "Error: " + e.message;
            resultBox.className = "result no";
        }
    };

    regexInput.addEventListener("input", update);
    flagsInput.addEventListener("input", update);
    testString.addEventListener("input", update);
}
