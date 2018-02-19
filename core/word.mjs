const c = ['l', 'p', 'b', 't', 'd', 'm', 'k', 'g', 'n', 'f', 'v', 's', 'c', 'z', 'j', 'ch', 'r', 'h', 'w', 'ng', 'th'];
const v = ['a', 'ey', 'e', 'o', 'or', 'u', 'ir', 'oo', 'i', 'oy', 'ow', 're', 'wer', 'are', 'iew', 'ye', 'you'];

﻿const Words = [
    'yellow',
    'blue',
    'red',
    'pink',
    'green',
    'violet',
    'orange',
    'sunny',
    'skye',
    'lemon',
    'maxi',
    'cisco',
    'fidelio',
    'moonshine',
    'tweets',
    'minnie',
    'silly',
    'pearl',
    'penny',
    'pirate',
    'molly',
    'ozzy',
    'candy',
    'tweety',
    'belle',
    'mickey',
    'april',
    'bibi',
    'kiwi',
    'willy',
    'sweetie',
    'tootsie',
    'jaybird',
    'calypso',
    'yoda',
    'picasso',
    'pandora',
    'goldie',
    'kelly',
    'kio',
    'vanilla',
    'sophie',
    'skittles',
    'peanut',
    'tookie',
    'clementine',
    'rosie',
    'cosmo',
    'flash',
    'melody'
];
const OtherSymbolsCount = 3;
const OtherSymbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default class Word {
    static genPattern(n) {
        let pattern = Math.floor(Math.random() * 5) ? '10' : '01';
        for (let i = 0; i < n - 2; i++) {
            pattern += Number(Math.round(Math.random() * 3));
        }
        return pattern;
    }

    static genChar(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static genWord(pattern) {
        let word = '';
        for (let i = 0; i < pattern.length; i++) {
            let kind = Number(pattern[i]);
            word += Word.genChar(kind ? c : v);
        }
        return word;
    }

    static generateOld() {
        let length = 2 + (Math.floor(Math.random() * 10) ? 1 : 0) + (Math.floor(Math.random() * 10) ? 1 : 0);
        return Word.genWord(Word.genPattern(length)) + Math.round(Math.random() * 1000);;
    }

    static generate() {
        return Word.generateRoomUniqName(Words, OtherSymbols, OtherSymbolsCount)
    }

    static generateRoomUniqName(Words, OtherSymbols, OtherSymbolsCount) {
        let word = Words[Math.floor(Math.random() * Words.length)];
        let randomPart = '';

        for (let i = 0; i < OtherSymbolsCount; i++) {
            let randomPos = Math.floor(Math.random() * OtherSymbols.length);
            randomPart += OtherSymbols.substring(randomPos, randomPos + 1);
        }

        let FinalWord = `${word}-${randomPart}`;
        return FinalWord;
    }
}