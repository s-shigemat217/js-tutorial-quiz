class WordQuiz {
    constructor(rootElm){
        this.rootElm = rootElm;
    }

    async init() {
        await this.fetchQuizData();
        this.displayStartView();
    }

    async fetchQuizData() {
        try {
            // クイズデータを非同期で読み込む
            const response = await fetch('./assets/data/quiz.json');
            this.quizData = await response.json();
            console.log("クイズデータの読み込みに成功しました:", this.quizData);
        } catch (error) {
            console.error("初期化中にエラーが発生しました:", error);
        }
    }

    displayStartView(){
        const levelStrs = Object.keys(this.quizData);
        const optionStrs = [];
        for (const levelStr of levelStrs) {
            optionStrs.push(`<option value="${levelStr}">${levelStr}</option>`);
        }
        const html = `
            <h1>クイズゲーム</h1>
            <p>レベルを選択してください:</p>
            <select class="level-selector">
                ${optionStrs.join('')}
            </select>
        `;
        const parentElm = document.createElement('div');
        parentElm.innerHTML = html;

        this.rootElm.appendChild(parentElm);
    }
}

new WordQuiz(document.getElementById('app')).init();
