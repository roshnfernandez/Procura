export function passwordGenerator(includeLowercaseAlphabets, includeUppercaseAlphabets,includeNumbers, includeSpecialCharacters, length){
    const upperCaseAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const loweCaseAlphabets = "abcdefghijklmopqrstuvwxyz";
    const numbers = "1234567890";
    const specialCharacters = "!@#$%^&*";
    var choiceArray = "";
    var res ="";
    if(includeLowercaseAlphabets) choiceArray+=loweCaseAlphabets;
    if(includeUppercaseAlphabets) choiceArray+=upperCaseAlphabets;
    if(includeNumbers) choiceArray+=numbers;
    if(includeSpecialCharacters) choiceArray +=specialCharacters;
    for(var i = 0; i<length; i++){
        res+=choiceArray.charAt(Math.floor(Math.random() * choiceArray.length + 1));
    }
    return res;
}