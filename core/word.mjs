const c = ['l','p','b','t','d','m','k','g','n','f','v','s','c','z','j','ch','r','h','w','ng','th'];
const v = ['a','ey','e','o','or','u','ir','oo','i','oy','ow','re','wer','are','iew','ye','you'];

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

    static generate() {
        let length = 2 + (Math.floor(Math.random() * 10) ? 1 : 0) + (Math.floor(Math.random() * 10) ? 1 : 0);
        return Word.genWord(Word.genPattern(length));
    }
}