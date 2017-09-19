const c = ['l','p','b','t','d','m','k','g','n','f','v','s','c','z','j','ch','r','h','w','ng','th'];
const v = ['a','ey','e','o','or','u','ir','oo','i','oy','ow','re','wer','are','iew','ye','you'];

export default class Word {
    private static genPattern(n: number): string {
        let pattern: string = Math.floor(Math.random() * 5) ? '10' : '01';
        for (let i = 0; i < n - 2; i++) {
            pattern += Number(Math.round(Math.random() * 3));
        }
        return pattern;
    }

    private static genChar(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private static genWord(pattern: string): string {
        let word: string = '';
        for (let i = 0; i < pattern.length; i++) {
            let kind: Number = Number(pattern[i]);
            word += Word.genChar(kind ? c : v);
        }
        return word;
    }

    public static generate() {
        let length = 2 + (Math.floor(Math.random() * 10) ? 1 : 0) + (Math.floor(Math.random() * 10) ? 1 : 0);
        return Word.genWord(Word.genPattern(length));
    }
}